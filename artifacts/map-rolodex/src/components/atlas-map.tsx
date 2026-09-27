import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import type { MapContact } from '@/lib/types';
import { fullName } from '@/lib/types';

type Props = { contacts: MapContact[]; selectedId: string | null; onSelect: (id: string) => void };
type PeoplePicker = { people: MapContact[]; x: number; y: number };

export function AtlasMap({ contacts, selectedId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
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
    if (!container.current) return;
    const instance = new maplibregl.Map({
      container: container.current,
      style: {
        version: 8,
        glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
        sources: {
          carto: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          },
        },
        layers: [{ id: 'carto-base', type: 'raster', source: 'carto' }],
      },
      center: [12, 22],
      zoom: 1.65,
      minZoom: 1,
      maxZoom: 16,
      attributionControl: false,
    });
    map.current = instance;
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    instance.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
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
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 11, 'text-font': ['Open Sans Bold'] },
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
      instance.on('click', 'clusters', async (event) => {
        setPicker(null);
        const features = instance.queryRenderedFeatures(event.point, { layers: ['clusters'] });
        const id = features[0]?.properties?.cluster_id;
        if (typeof id !== 'number') return;
        try {
          const zoom = await (instance.getSource('people') as GeoJSONSource).getClusterExpansionZoom(id);
          const coordinates = 'coordinates' in features[0].geometry
            ? features[0].geometry.coordinates as [number, number] : null;
          if (!coordinates) return;
          instance.easeTo({ center: coordinates, zoom, duration: 550 });
        } catch { /* Source may have changed while zooming. */ }
      });
      instance.on('click', 'person-pin', (event) => {
        const features = instance.queryRenderedFeatures(event.point, { layers: ['person-pin'] });
        const id = features[0]?.properties?.id;
        if (typeof id !== 'string') return;
        const clicked = contactsRef.current.find(person => person.id === id);
        if (!clicked) return;
        // At a city's exact coordinates, MapLibre draws individual features on top
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
    return () => { instance.remove(); map.current = null; };
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