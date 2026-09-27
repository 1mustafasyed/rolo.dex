import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl';
import type { MapContact } from '@/lib/types';
import { fullName } from '@/lib/types';

type Props = { contacts: MapContact[]; selectedId: string | null; onSelect: (id: string) => void };
type PeoplePicker = { people: MapContact[]; x: number; y: number };
const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN?.trim();

export function AtlasMap({ contacts, selectedId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const onSelectRef = useRef(onSelect);
  const contactsRef = useRef(contacts);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);
  const [picker, setPicker] = useState<PeoplePicker | null>(null);
  onSelectRef.current = onSelect;
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
      const zoom = Math.max(instance.getMinZoom(), Math.min(instance.getMaxZoom(), instance.getZoom() + change));
      instance.easeTo({ zoom, around: instance.unproject(pointFromClient(x, y)), duration: 0 });
    };
    let safariGestureActive = false;
    let previousGestureScale = 1;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (safariGestureActive) return;
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? canvasContainer.clientHeight : 1;
      if (event.ctrlKey) {
        // Browsers report trackpad pinches as Ctrl+wheel, unlike two-finger scrolling.
        zoomAt(-event.deltaY * unit / 100, event.clientX, event.clientY);
      } else {
        instance.panBy([event.deltaX * unit, event.deltaY * unit], { duration: 0 });
      }
    };
    const handleGestureStart = (event: Event) => {
      event.preventDefault();
      safariGestureActive = true;
      previousGestureScale = (event as Event & { scale: number }).scale || 1;
    };
    const handleGestureChange = (event: Event) => {
      event.preventDefault();
      const gesture = event as Event & { scale: number; clientX: number; clientY: number };
      if (!gesture.scale || !safariGestureActive) return;
      const rect = canvasContainer.getBoundingClientRect();
      zoomAt(Math.log2(gesture.scale / previousGestureScale),
        gesture.clientX || rect.left + rect.width / 2,
        gesture.clientY || rect.top + rect.height / 2);
      previousGestureScale = gesture.scale;
    };
    const handleGestureEnd = (event: Event) => {
      event.preventDefault();
      safariGestureActive = false;
    };
    canvasContainer.addEventListener('wheel', handleWheel, { passive: false });
    canvasContainer.addEventListener('gesturestart', handleGestureStart, { passive: false });
    canvasContainer.addEventListener('gesturechange', handleGestureChange, { passive: false });
    canvasContainer.addEventListener('gestureend', handleGestureEnd, { passive: false });
    instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    instance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
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
        paint: { 'circle-color': '#e99775', 'circle-radius': ['step', ['get', 'point_count'], 25, 10, 31, 35, 38], 'circle-opacity': .14 },
      });
      instance.addLayer({
        id: 'clusters', type: 'circle', source: 'people',
        filter: ['has', 'point_count'],
        paint: { 'circle-color': '#e99775', 'circle-radius': ['step', ['get', 'point_count'], 17, 10, 21, 35, 26], 'circle-stroke-width': 2, 'circle-stroke-color': '#192831' },
      });
      instance.addLayer({
        id: 'cluster-count', type: 'symbol', source: 'people',
        filter: ['has', 'point_count'],
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 11, 'text-font': ['DIN Pro Bold'] },
        paint: { 'text-color': '#17252b' },
      });
      instance.addLayer({
        id: 'person-halo', type: 'circle', source: 'people',
        filter: ['!', ['has', 'point_count']],
        paint: { 'circle-color': '#e99775', 'circle-opacity': .19, 'circle-radius': 14 },
      });
      instance.addLayer({
        id: 'person-pin', type: 'circle', source: 'people',
        filter: ['!', ['has', 'point_count']],
        paint: { 'circle-color': '#e99775', 'circle-radius': 6, 'circle-stroke-width': 2, 'circle-stroke-color': '#13262c' },
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
        // At a city's exact coordinates, the map draws individual features on top
        // of each other after the native cluster expands. Offer every person there.
        const people = contactsRef.current.filter(person =>
          Number(person.longitude) === Number(clicked.longitude) &&
          Number(person.latitude) === Number(clicked.latitude)
        ).sort((a, b) => fullName(a).localeCompare(fullName(b)));
        if (people.length === 1) {
          setPicker(null);
          onSelectRef.current(id);
        } else {
          const point = instance.project([Number(clicked.longitude), Number(clicked.latitude)]);
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
    });
    return () => {
      canvasContainer.removeEventListener('wheel', handleWheel);
      canvasContainer.removeEventListener('gesturestart', handleGestureStart);
      canvasContainer.removeEventListener('gesturechange', handleGestureChange);
      canvasContainer.removeEventListener('gestureend', handleGestureEnd);
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
          geometry: { type: 'Point' as const, coordinates: [Number(contact.longitude), Number(contact.latitude)] },
          properties: { id: contact.id },
        })),
      });
    };
    if (instance.getSource('people')) update();
    else instance.on('load', update);
    return () => { instance.off('load', update); };
  }, [contacts]);

  useEffect(() => {
    const instance = map.current;
    const contact = contacts.find(person => person.id === selectedId);
    if (instance && contact) {
      instance.easeTo({ center: [Number(contact.longitude), Number(contact.latitude)], zoom: Math.max(instance.getZoom(), 5), duration: 650, offset: window.innerWidth > 680 ? [-130, 0] : [0, -110] });
    }
  }, [selectedId, contacts]);

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