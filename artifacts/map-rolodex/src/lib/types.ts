export const CONNECTION_TYPES = ['Work', 'Event', 'Peer', 'Family', 'Professor'] as const;
export type ConnectionType = typeof CONNECTION_TYPES[number];

export interface Place {
  id: string;
  city: string;
  region: string | null;
  country_code: string;
}

export interface Contact {
  id: string;
  owner_id: string;
  first_name: string;
  last_name: string | null;
  job_title: string | null;
  company: string | null;
  email: string | null;
  connection_type: ConnectionType | null;
  how_we_met: string | null;
  place_id: string | null;
}

export interface MapContact extends Contact {
  source: string | null;
  location_confirmed_at: string | null;
  updated_at: string | null;
  city: string | null;
  region: string | null;
  country_code: string | null;
  latitude: number | null;
  longitude: number | null;
}

export type ContactInput = {
  first_name: string;
  last_name: string | null;
  job_title: string | null;
  company: string | null;
  email: string | null;
  connection_type: ConnectionType | null;
  how_we_met: string | null;
  place_id: string | null;
};

export const fullName = (contact: Pick<Contact, 'first_name' | 'last_name'>) =>
  [contact.first_name, contact.last_name].filter(Boolean).join(' ');

export const placeLabel = (place: Pick<Place, 'city' | 'region' | 'country_code'>) =>
  [place.city, place.region, place.country_code].filter(Boolean).join(', ');