import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Check, ChevronDown, X } from 'lucide-react';
import { CONNECTION_TYPES, fullName, placeLabel, type Contact, type ContactInput, type Place } from '@/lib/types';

type Props = {
  contact?: Contact | null;
  places: Place[];
  placesError?: string;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (input: ContactInput) => Promise<void>;
};
const fromContact = (contact?: Contact | null) => ({
  first_name: contact?.first_name || '',
  last_name: contact?.last_name || '',
  job_title: contact?.job_title || '',
  company: contact?.company || '',
  email: contact?.email || '',
  connection_type: contact?.connection_type || '',
  how_we_met: contact?.how_we_met || '',
  place_id: contact?.place_id || '',
});

export function ContactForm({ contact, places, placesError, pending, error, onClose, onSave }: Props) {
  const [form, setForm] = useState(fromContact(contact));
  const [citySearch, setCitySearch] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  useEffect(() => {
    setForm(fromContact(contact));
    setCitySearch('');
  }, [contact]);
  const selectedPlace = places.find(place => place.id === form.place_id);
  const matches = useMemo(() => places.filter(place => placeLabel(place).toLowerCase().includes(citySearch.toLowerCase())).slice(0, 70), [places, citySearch]);
  const set = (field: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [field]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim() || null,
      job_title: form.job_title.trim() || null,
      company: form.company.trim() || null,
      email: form.email.trim() || null,
      connection_type: (form.connection_type || null) as ContactInput['connection_type'],
      how_we_met: form.how_we_met.trim() || null,
      place_id: form.place_id || null,
    });
  };
  return <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="contact-form-heading">
      <div className="modal-head">
        <div><span className="eyebrow">Your private atlas / Contact record</span><h2 id="contact-form-heading">{contact ? `Edit ${fullName(contact)}` : 'Add a connection'}</h2></div>
        <button className="icon-btn" type="button" onClick={onClose} aria-label="Close form" data-testid="button-close-form"><X size={17} /></button>
      </div>
      <form onSubmit={submit} className="modal-body">
        <div className="form-grid">
          <div className="field"><label htmlFor="first-name">First name *</label><input id="first-name" data-testid="input-first-name" required autoFocus value={form.first_name} onChange={event => set('first_name', event.target.value)} placeholder="First name" /></div>
          <div className="field"><label htmlFor="last-name">Last name</label><input id="last-name" data-testid="input-last-name" value={form.last_name} onChange={event => set('last_name', event.target.value)} placeholder="Last name" /></div>
          <div className="field"><label htmlFor="job-title">Job title</label><input id="job-title" data-testid="input-job-title" value={form.job_title} onChange={event => set('job_title', event.target.value)} placeholder="What they do" /></div>
          <div className="field"><label htmlFor="company">Company</label><input id="company" data-testid="input-company" value={form.company} onChange={event => set('company', event.target.value)} placeholder="Where they work" /></div>
        </div>
        <div className="field"><label htmlFor="contact-email">Email</label><input type="email" id="contact-email" data-testid="input-contact-email" value={form.email} onChange={event => set('email', event.target.value)} placeholder="name@example.com" /></div>
        <div className="form-grid">
          <div className="field"><label htmlFor="connection-type">Connection</label><select id="connection-type" data-testid="select-connection-type" value={form.connection_type} onChange={event => set('connection_type', event.target.value)}><option value="">Not specified</option>{CONNECTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
          <div className="field city-picker">
            <label htmlFor="city-search">Known city</label>
            <div style={{ position: 'relative' }}>
              <input id="city-search" data-testid="input-city-search" autoComplete="off" value={cityOpen ? citySearch : selectedPlace ? placeLabel(selectedPlace) : ''} onFocus={() => { setCityOpen(true); setCitySearch(''); }} onChange={event => { setCitySearch(event.target.value); setCityOpen(true); }} placeholder="Search existing cities" />
              {form.place_id && !cityOpen && <button type="button" className="icon-btn" data-testid="button-clear-city" aria-label="Remove city" onClick={() => { set('place_id', ''); setCitySearch(''); }} style={{ position: 'absolute', right: 4, top: 4, width: 33, height: 33 }}><X size={13} /></button>}
              {!form.place_id && !cityOpen && <ChevronDown size={14} style={{ position: 'absolute', right: 14, top: 14, pointerEvents: 'none', color: '#8ba7a6' }} />}
              {cityOpen && <div className="city-picker-menu">
                <button className="city-option" type="button" data-testid="button-no-city" onClick={() => { set('place_id', ''); setCityOpen(false); setCitySearch(''); }}>No city / remove location</button>
                {matches.map(place => <button key={place.id} className="city-option" data-testid={`button-city-${place.id}`} type="button" onClick={() => { set('place_id', place.id); setCityOpen(false); setCitySearch(''); }}>{placeLabel(place)} {place.id === form.place_id && <Check size={12} style={{ float: 'right' }} />}</button>)}
                {!matches.length && <div className="city-option">No matching cities in your places list.</div>}
              </div>}
            </div>
          </div>
        </div>
        {placesError && <div className="error-box" role="alert">Cities could not be loaded: {placesError}</div>}
        <p className="form-note">Choose an existing city only. Contacts without a city stay in your list but not on the map.</p>
        <div className="field"><label htmlFor="how-met">How you met</label><textarea id="how-met" data-testid="input-how-met" value={form.how_we_met} onChange={event => set('how_we_met', event.target.value)} placeholder="A detail worth remembering..." /></div>
        {error && <div className="error-box" role="alert" data-testid="error-contact-form">{error}</div>}
        <div className="form-actions"><button className="ghost-btn" type="button" onClick={onClose} data-testid="button-cancel-contact">Cancel</button><button className="primary-btn" type="submit" disabled={pending || !form.first_name.trim()} data-testid="button-save-contact">{pending ? 'Saving...' : contact ? 'Save changes' : 'Add connection'} <ArrowRight size={14} /></button></div>
      </form>
    </section>
  </div>;
}