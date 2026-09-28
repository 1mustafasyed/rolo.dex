import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl';
import type { MapContact } from '@/lib/types';
import { fullName } from '@/lib/types';
import { displayPosition, sampleDisplayPosition } from '@/lib/sample-display-position';

type Props = { contacts: MapContact[]; selectedId: string | null; onSelect: (id: string) => void; onReady?: () => void };
type PeoplePicker = { people: MapContact[]; x: number; y: number };
const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN?.trim();

export function AtlasMap({ contacts, selectedId, onSelect, onReady }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const onSelectRef = useRef(onSelect);
  const onReadyRef = useRef(onReady);
  const contactsRef = useRef(contacts);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);
  const [picker, setPicker] = useState<PeoplePicker | null>(null);
  const positions = useMemo(() => new Map(contacts.map(person => [person.id, displayPosition(person)])), [contacts]);
  const hasIllustrativePins = contacts.some(person => sampleDisplayPosition(person) !== null);
  onSelectRef.current = onSelect;
  onReadyRef.current = onReady;
  contactsRef.current = contacts;

  useEffect(() => {
    if (picker) firstChoiceRef.current?.focus();
  }, [picker]);

  useEffect(() => {
    if (!container.current || !mapboxToken) return;
    const instance = new mapboxgl.Map({
      container: container.current,
      accessToken: mapboxToken,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [12, 22],
      zoom: 1.65,
      minZoom: 1,
      maxZoom: 16,
      attributionControl: false,
      scrollZoom: false,
    });
    map.current = instance;
    const canvasContainer = instance.getCanvasContainer();
    const pointFromClient = (x: number, y: number): [number, number] => {
      const rect = canvasContainer.getBoundingClientRect();
      return [x - rect.left, y - rect.top];
    };
    const zoomAt = (change: number, x: number, y: number) => {
      if (!Number.isFinite(change) || change === 0) return;
      const zoom = Math.max(instance.getMinZoom(), Math.min(instance.getMaxZoom(), instance.getZoom() + change));
      instance.jumpTo({ zoom, around: instance.unproject(pointFromClient(x, y)) });
    };
    let safariGestureActive = false;
    let previousGestureScale = 1;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (safariGestureActive) return;
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? canvasContainer.clientHeight : 1;
      if (event.ctrlKey || event.deltaZ !== 0) {
        // Follow every pinch wheel event, including any momentum events the device sends.
        zoomAt(-(event.deltaZ || event.deltaY) * unit / 100, event.clientX, event.clientY);
      } else {
        instance.panBy([event.deltaX * unit, event.deltaY * unit], { duration: 0 });
      }
    };
    const handleGestureStart = (event: Event) => {
      const gesture = event as Event & { scale?: number; clientX?: number; clientY?: number };
      const rect = canvasContainer.getBoundingClientRect();
      const onCanvas = event.target instanceof Node && canvasContainer.contains(event.target);
      const inBounds = typeof gesture.clientX === 'number' && typeof gesture.clientY === 'number'
        && gesture.clientX >= rect.left && gesture.clientX <= rect.right
        && gesture.clientY >= rect.top && gesture.clientY <= rect.bottom;
      if (!onCanvas && !inBounds) return;
      event.preventDefault();
      safariGestureActive = true;
      previousGestureScale = gesture.scale || 1;
    };
    const handleGestureChange = (event: Event) => {
      if (!safariGestureActive) return;
      event.preventDefault();
      const gesture = event as Event & { scale?: number; clientX?: number; clientY?: number };
      if (!gesture.scale || gesture.scale <= 0 || previousGestureScale <= 0) return;
      const rect = canvasContainer.getBoundingClientRect();
      zoomAt(Math.log2(gesture.scale / previousGestureScale),
        typeof gesture.clientX === 'number' ? gesture.clientX : rect.left + rect.width / 2,
        typeof gesture.clientY === 'number' ? gesture.clientY : rect.top + rect.height / 2);
      previousGestureScale = gesture.scale;
    };
    const handleGestureEnd = (event: Event) => {
      if (!safariGestureActive) return;
      event.preventDefault();
      safariGestureActive = false;
    };
    const handleGestureCancel = () => {
      safariGestureActive = false;
    };
    canvasContainer.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('gesturestart', handleGestureStart, { capture: true, passive: false });
    document.addEventListener('gesturechange', handleGestureChange, { capture: true, passive: false });
    document.addEventListener('gestureend', handleGestureEnd, { capture: true, passive: false });
    document.addEventListener('gesturecancel', handleGestureCancel, true);
    instance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');
    instance.on('load', () => {
      instance.addSource('people', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 48,
      });
      instance.addLayer({
        id: 'cluster-halo', type: 'circle', source: 'people',
        filter: ['has', 'point_count'],
        paint: { 'circle-color': '#c77a5f', 'circle-radius': ['step', ['get', 'point_count'], 25, 10, 31, 35, 38], 'circle-opacity': .18 },
      });
      instance.addLayer({
        id: 'clusters', type: 'circle', source: 'people',
        filter: ['has', 'point_count'],
        paint: { 'circle-color': '#c77a5f', 'circle-radius': ['step', ['get', 'point_count'], 17, 10, 21, 35, 26], 'circle-stroke-width': 2, 'circle-stroke-color': '#292929' },
      });
      instance.addLayer({
        id: 'cluster-count', type: 'symbol', source: 'people',
        filter: ['has', 'point_count'],
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 11, 'text-font': ['DIN Pro Bold'] },
        paint: { 'text-color': '#1f1f1f' },
      });
      instance.addLayer({
        id: 'person-halo', type: 'circle', source: 'people',
        filter: ['!', ['has', 'point_count']],
        paint: { 'circle-color': '#c77a5f', 'circle-opacity': .22, 'circle-radius': 14 },
      });
      instance.addLayer({
        id: 'person-pin', type: 'circle', source: 'people',
        filter: ['!', ['has', 'point_count']],
        paint: { 'circle-color': '#dfa18a', 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#1f1f1f' },
      });
      instance.on('click', 'clusters', (event) => {
        setPicker(null);
        const features = instance.queryRenderedFeatures(event.point, { layers: ['clusters'] });
        const feature = features[0] as { properties?: { cluster_id?: number }; geometry?: { type: string; coordinates?: number[] } } | undefined;
        const id = feature?.properties?.cluster_id;
        if (typeof id !== 'number') return;
        const coordinates = feature?.geometry?.type === 'Point' ? feature.geometry.coordinates : undefined;
        if (!coordinates || coordinates.length < 2) return;
        (instance.getSource('people') as GeoJSONSource).getClusterExpansionZoom(id, (error, zoom) => {
          if (!error && typeof zoom === 'number') {
            instance.easeTo({ center: [coordinates[0], coordinates[1]], zoom, duration: 550 });
          }
        });
      });
      instance.on('click', 'person-pin', (event) => {
        const features = instance.queryRenderedFeatures(event.point, { layers: ['person-pin'] });
        const feature = features[0] as { properties?: { id?: string } } | undefined;
        const id = feature?.properties?.id;
        if (typeof id !== 'string') return;
        const clicked = contactsRef.current.find(person => person.id === id);
        if (!clicked) return;
        // Center-pin fallbacks can still overlap after a cluster expands.
        const clickedPosition = displayPosition(clicked);
        const people = contactsRef.current.filter(person =>
          displayPosition(person)[0] === clickedPosition[0] &&
          displayPosition(person)[1] === clickedPosition[1]
        ).sort((a, b) => fullName(a).localeCompare(fullName(b)));
        if (people.length === 1) {
          setPicker(null);
          onSelectRef.current(id);
        } else {
          const point = instance.project(clickedPosition);
          setPicker({ people, x: point.x, y: point.y });
        }
      });
      instance.on('click', (event) => {
        if (!instance.queryRenderedFeatures(event.point, { layers: ['person-pin'] }).length) setPicker(null);
      });
      instance.on('movestart', () => setPicker(null));
      for (const layer of ['clusters', 'person-pin']) {
        instance.on('mouseenter', layer, () => { instance.getCanvas().style.cursor = 'pointer'; });
        instance.on('mouseleave', layer, () => { instance.getCanvas().style.cursor = ''; });
      }
      onReadyRef.current?.();
    });
    return () => {
      canvasContainer.removeEventListener('wheel', handleWheel);
      document.removeEventListener('gesturestart', handleGestureStart, true);
      document.removeEventListener('gesturechange', handleGestureChange, true);
      document.removeEventListener('gestureend', handleGestureEnd, true);
      document.removeEventListener('gesturecancel', handleGestureCancel, true);
      instance.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    const update = () => {
      const source = instance.getSource('people') as GeoJSONSource | undefined;
      source?.setData({
        type: 'FeatureCollection',
        features: contacts.map(contact => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: positions.get(contact.id)! },
          properties: { id: contact.id },
        })),
      });
    };
    if (instance.getSource('people')) update();
    else instance.on('load', update);
    return () => { instance.off('load', update); };
  }, [contacts, positions]);

  useEffect(() => {
    const instance = map.current;
    const position = selectedId ? positions.get(selectedId) : undefined;
    if (instance && position) {
      instance.easeTo({ center: position, zoom: Math.max(instance.getZoom(), 5), duration: 650, offset: window.innerWidth > 680 ? [0, 0] : [0, -110] });
    }
  }, [selectedId, positions]);

  const choose = (id: string) => {
    setPicker(null);
    onSelectRef.current(id);
    container.current?.querySelector('canvas')?.focus();
  };
  const closePicker = () => {
    setPicker(null);
    container.current?.querySelector('canvas')?.focus();
  };
  return <div className="map-stage">
    <div ref={container} className="map-canvas" data-testid="map-atlas" aria-label="World map of your contacts. Use the contact list to access every person by keyboard." />
    {hasIllustrativePins && <div className="sample-map-note">
      Sample pins show illustrative positions within mapped city limits, not real locations.
      {' '}Boundary data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>.
    </div>}
    {!mapboxToken && <div className="map-setup-error" role="alert">
      Mapbox is not connected yet. Add your public token as the <code>VITE_MAPBOX_ACCESS_TOKEN</code> Replit Secret to load the map.
    </div>}
    {picker && <div
      className="map-people-picker"
      style={{
        left: Math.max(12, Math.min(picker.x, (container.current?.clientWidth || window.innerWidth) - 282)),
        top: Math.max(85, Math.min(picker.y + 18, (container.current?.clientHeight || window.innerHeight) - 210)),
      }}
      role="dialog"
      aria-label={`${picker.people.length} people at this location`}
      data-testid="picker-map-people"
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closePicker();
        }
      }}
    >
      <div className="map-people-picker-head"><span className="eyebrow">{picker.people.length} people at this location</span><button type="button" aria-label="Close people picker" data-testid="button-close-map-picker" onClick={closePicker}>×</button></div>
      <div className="map-people-picker-list">
        {picker.people.map((person, index) => <button
          key={person.id}
          ref={index === 0 ? firstChoiceRef : undefined}
          type="button"
          className="map-people-picker-person"
          onClick={() => choose(person.id)}
          data-testid={`button-map-person-${person.id}`}
        ><span className="avatar">{(person.first_name?.[0] || '') + (person.last_name?.[0] || '')}</span><span><strong>{fullName(person)}</strong><small>{[person.job_title, person.company].filter(Boolean).join(' · ') || person.connection_type || 'Connection'}</small></span></button>)}
      </div>
    </div>}
  </div>;
}