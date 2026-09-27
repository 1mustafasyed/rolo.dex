import { useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ArrowLeft, Compass, MapPin, Plus, Search, LogOut, Trash2, X, Pencil, RefreshCw, Users, ChevronRight } from 'lucide-react';
import { AtlasMap } from '@/components/atlas-map';
import { ContactForm } from '@/components/contact-form';
import { useAtlas } from '@/hooks/use-atlas';
import { fullName, placeLabel, type Contact, type ContactInput, type MapContact } from '@/lib/types';

type Tab = 'all' | 'mapped' | 'unmapped';

export default function AtlasPage({ session, onSignOut }: { session: Session; onSignOut: () => Promise<void> }) {
  const { view, contacts, places, create, update, remove, seed, refresh } = useAtlas(session.user.id);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<'new' | 'edit' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const mapped = useMemo(() => (view.data || []).filter(person =>
    person.place_id != null && person.latitude != null && person.longitude != null &&
    Number.isFinite(Number(person.latitude)) && Number.isFinite(Number(person.longitude)) &&
    Math.abs(Number(person.latitude)) <= 90 && Math.abs(Number(person.longitude)) <= 180,
  ), [view.data]);
  const mappedById = useMemo(() => new Map(mapped.map(person => [person.id, person])), [mapped]);
  const people = contacts.data || [];
  const selected = people.find(person => person.id === selectedId) || null;
  const selectedMap = selected ? mappedById.get(selected.id) : undefined;
  const selectedPlace = selected?.place_id ? places.data?.find(place => place.id === selected.place_id) : undefined;
  const unmappedCount = people.filter(person => !mappedById.has(person.id)).length;
  const listed = people.filter(person => {
    if (tab === 'mapped' && !mappedById.has(person.id)) return false;
    if (tab === 'unmapped' && mappedById.has(person.id)) return false;
    const place = person.place_id ? places.data?.find(item => item.id === person.place_id) : undefined;
    return [fullName(person), person.company, person.job_title, place?.city, mappedById.get(person.id)?.city]
      .some(value => value?.toLowerCase().includes(search.toLowerCase().trim()));
  }).sort((a, b) => fullName(a).localeCompare(fullName(b)));
  const getLocation = (person: Contact, mapPerson?: MapContact) => {
    if (mapPerson?.city) return [mapPerson.city, mapPerson.country_code].filter(Boolean).join(', ');
    const place = person.place_id ? places.data?.find(item => item.id === person.place_id) : undefined;
    return place ? placeLabel(place) : 'No city set';
  };
  const save = async (input: ContactInput) => {
    setFormError(null);
    try {
      if (form === 'edit' && selected) await update.mutateAsync({ id: selected.id, input });
      else await create.mutateAsync(input);
      setForm(null);
      setActionError(null);
    } catch (caught) { setFormError(caught instanceof Error ? caught.message : 'Could not save this contact.'); }
  };
  const deleteSelected = async () => {
    if (!selected) return;
    setActionError(null);
    try {
      await remove.mutateAsync(selected.id);
      setSelectedId(null);
      setConfirmDelete(false);
    } catch (caught) { setActionError(caught instanceof Error ? caught.message : 'Could not delete this contact.'); }
  };
  const seedContacts = async () => {
    setActionError(null);
    try { await seed.mutateAsync(); }
    catch (caught) { setActionError(caught instanceof Error ? caught.message : 'Could not add sample contacts.'); }
  };
  const logout = async () => {
    setSigningOut(true); setActionError(null);
    try { await onSignOut(); } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Could not sign out.');
      setSigningOut(false);
    }
  };
  const loading = contacts.isPending || view.isPending;
  const dataError = contacts.error || view.error;
  return <main className="shell">
    <AtlasMap contacts={mapped} selectedId={selectedMap ? selectedId : null} onSelect={setSelectedId} />
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><Compass size={21} strokeWidth={1.4} /></span><span className="brand-name">Map Rolodex</span></div>
      <div className="topbar-center"><span className="live-dot" /> YOUR PRIVATE RELATIONSHIP ATLAS</div>
      <div className="topbar-actions">
        <span className="user-email" data-testid="text-user-email">{session.user.email}</span>
        <button className="icon-btn" title="Refresh contacts" aria-label="Refresh contacts" data-testid="button-refresh" onClick={() => { setActionError(null); refresh().catch(error => setActionError(String(error))); }}><RefreshCw size={15} /></button>
        <button className="icon-btn" title="Sign out" aria-label="Sign out" data-testid="button-sign-out" onClick={logout} disabled={signingOut}><LogOut size={16} /></button>
        <button className="primary-btn" data-testid="button-add-contact-top" onClick={() => { setFormError(null); setForm('new'); }}><Plus size={16} /> Add connection</button>
      </div>
    </header>
    <aside className="left-panel" aria-label="Your contacts">
      <div className="panel-intro">
        <span className="eyebrow">The people behind the places / 01</span>
        <h1 className="panel-title">Your world, <i>connected.</i></h1>
        <p className="panel-copy">A geography of the people worth keeping close.</p>
        <div className="stat-row"><div className="stat"><strong data-testid="text-total-contacts">{people.length}</strong><span>People</span></div><div className="stat"><strong data-testid="text-mapped-contacts">{mapped.length}</strong><span>On map</span></div><div className="stat"><strong data-testid="text-unmapped-contacts">{unmappedCount}</strong><span>Unplaced</span></div></div>
      </div>
      <div className="panel-tools">
        <div className="search-wrap"><Search size={15} /><input className="search-input" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Find someone in your atlas..." aria-label="Search contacts" data-testid="input-search-contacts" /></div>
        <div className="tabs" role="tablist" aria-label="Contact list">
          {([['all', 'All people'], ['mapped', 'On map'], ['unmapped', `No city${unmappedCount ? ` ${unmappedCount}` : ''}`]] as const).map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} className={`tab ${tab === id ? 'active' : ''}`} data-testid={`tab-${id}`} onClick={() => setTab(id)}>{label}</button>)}
        </div>
      </div>
      <div className="list-scroll">
        {dataError && <div className="error-box" role="alert" data-testid="error-atlas-data">Could not load your atlas: {dataError.message}<button data-testid="button-retry-atlas" onClick={() => { contacts.refetch(); view.refetch(); }}>Try again</button></div>}
        {places.error && <div className="error-box" role="alert" data-testid="error-places">Could not load cities: {places.error.message}<button data-testid="button-retry-places" onClick={() => places.refetch()}>Try again</button></div>}
        {actionError && <div className="error-box" role="alert" data-testid="error-atlas-action">{actionError}<button onClick={() => setActionError(null)} data-testid="button-dismiss-error">Dismiss</button></div>}
        {loading && Array.from({ length: 5 }).map((_, index) => <div className="loading-row" key={index}><div className="skeleton" /><div className="skeleton" /></div>)}
        {!loading && !dataError && people.length === 0 && <div className="empty">
          <div className="empty-orbit"><Users size={23} strokeWidth={1.3} /></div>
          <h3>Every atlas starts somewhere.</h3>
          <p>Add the first person you want to remember, or explore with sample contacts.</p>
          <button className="primary-btn" onClick={() => { setFormError(null); setForm('new'); }} data-testid="button-add-first-contact"><Plus size={14} /> Add your first person</button>
          <div style={{ marginTop: 11 }}><button className="ghost-btn" onClick={seedContacts} disabled={seed.isPending} data-testid="button-seed-contacts">{seed.isPending ? 'Adding samples...' : 'Add sample contacts'}</button></div>
        </div>}
        {!loading && !dataError && people.length > 0 && <>
          <div className="list-label">{listed.length} {listed.length === 1 ? 'connection' : 'connections'} in view</div>
          {listed.length === 0 ? <div className="empty"><div className="empty-orbit"><Search size={23} strokeWidth={1.3} /></div><h3>No one here yet.</h3><p>{search ? 'Try another name, company, or city.' : tab === 'unmapped' ? 'Everyone in your atlas has a place on the map.' : 'Your contacts without known coordinates will appear under No city.'}</p>{search && <button className="ghost-btn" onClick={() => setSearch('')} data-testid="button-clear-search">Clear search</button>}</div> :
            listed.map(person => {
              const mapPerson = mappedById.get(person.id);
              return <button key={person.id} className={`person-row ${selectedId === person.id ? 'selected' : ''}`} onClick={() => setSelectedId(person.id)} data-testid={`button-contact-${person.id}`}>
                <span className="avatar">{(person.first_name?.[0] || '') + (person.last_name?.[0] || '')}</span>
                <span className="person-info"><span className="person-name">{fullName(person)}</span><span className="person-sub">{[person.job_title, person.company].filter(Boolean).join(' · ') || person.connection_type || 'Connection'}</span></span>
                <span className="person-location"><MapPin size={11} />{mapPerson?.city || (person.place_id ? places.data?.find(place => place.id === person.place_id)?.city || 'Unknown' : 'Unplaced')}</span>
              </button>;
            })}
        </>}
      </div>
      <div className="panel-footer"><button className="primary-btn" data-testid="button-add-contact" onClick={() => { setFormError(null); setForm('new'); }}><Plus size={15} /> Add a person</button><button className="ghost-btn" data-testid="button-show-unmapped" onClick={() => { setTab('unmapped'); setSearch(''); }} title="See contacts without a city">No city <ChevronRight size={13} /></button></div>
    </aside>
    <div className="map-caption">Pan to explore&nbsp; / &nbsp;Scroll to zoom&nbsp; / &nbsp;Pins mark known cities</div>
    {selected && <aside className="detail-panel" aria-label={`${fullName(selected)} details`} data-testid="panel-contact-detail">
      <div className="detail-top">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span className="eyebrow">Connection / {selected.connection_type || 'Personal'}</span><button className="icon-btn" title="Close details" aria-label="Close details" data-testid="button-close-detail" onClick={() => setSelectedId(null)}><X size={15} /></button></div>
        <div className="avatar" style={{ width: 54, height: 54, fontSize: 19, marginTop: 20 }}>{(selected.first_name?.[0] || '') + (selected.last_name?.[0] || '')}</div>
        <h2 className="detail-heading" data-testid="text-contact-name">{fullName(selected)}</h2>
        <p className="detail-role">{[selected.job_title, selected.company].filter(Boolean).join(' at ') || 'A connection worth keeping'}</p>
      </div>
      <div className="detail-body">
        <div className="detail-field"><label>Known city</label><div data-testid="text-contact-city">{getLocation(selected, selectedMap)}{!selectedMap && <span style={{ display: 'block', color: '#83a6a5', fontSize: 11, marginTop: 5 }}>Not displayed on the map</span>}</div></div>
        <div className="detail-field"><label>Connection type</label><div data-testid="text-contact-type">{selected.connection_type || 'Not specified'}</div></div>
        <div className="detail-field"><label>How we met</label><div data-testid="text-contact-how-met">{selected.how_we_met || 'No story added yet.'}</div></div>
        <div className="detail-field"><label>Email</label>{selected.email ? <a href={`mailto:${selected.email}`} data-testid="link-contact-email">{selected.email}</a> : <div data-testid="text-contact-email">No email added</div>}</div>
        {selectedPlace && !selectedMap && <div className="detail-field"><label>Selected place</label><div>{placeLabel(selectedPlace)}</div></div>}
      </div>
      <div className="detail-actions"><button className="ghost-btn" onClick={() => { setFormError(null); setForm('edit'); }} data-testid="button-edit-contact"><Pencil size={14} /> Edit</button><button className="ghost-btn danger-btn" onClick={() => setConfirmDelete(true)} data-testid="button-delete-contact"><Trash2 size={14} /> Delete</button></div>
    </aside>}
    {form && <ContactForm key={form === 'edit' ? selected?.id : 'new'} contact={form === 'edit' ? selected : null} places={places.data || []} placesError={places.error?.message} pending={create.isPending || update.isPending} error={formError} onClose={() => setForm(null)} onSave={save} />}
    {confirmDelete && selected && <div className="overlay" onMouseDown={event => { if (event.target === event.currentTarget) setConfirmDelete(false); }}><section className="modal" style={{ maxWidth: 420 }} role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><div className="modal-head"><div><span className="eyebrow">Remove from atlas</span><h2 id="delete-title">Delete this connection?</h2></div><button className="icon-btn" onClick={() => setConfirmDelete(false)} aria-label="Close confirmation" data-testid="button-close-delete"><X size={16} /></button></div><div className="modal-body"><p style={{ color: '#aebdb8', fontSize: 13, lineHeight: 1.7, margin: '0 0 22px' }}>This permanently removes {fullName(selected)} from your atlas. This cannot be undone.</p>{actionError && <div className="error-box" role="alert">{actionError}</div>}<div className="form-actions"><button className="ghost-btn" onClick={() => setConfirmDelete(false)} data-testid="button-cancel-delete"><ArrowLeft size={14} /> Keep contact</button><button className="ghost-btn danger-btn" onClick={deleteSelected} disabled={remove.isPending} data-testid="button-confirm-delete"><Trash2 size={14} /> {remove.isPending ? 'Deleting...' : 'Delete contact'}</button></div></div></section></div>}
  </main>;
}