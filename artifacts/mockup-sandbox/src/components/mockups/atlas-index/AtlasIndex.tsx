import { useMemo, useState, type FormEvent } from "react";
import { ArrowDownUp, ArrowUpRight, Check, ChevronDown, Compass, MapPin, Plus, Search, SlidersHorizontal, Star, X } from "lucide-react";
import "./atlas-index.css";

type Person = {
  id: number;
  name: string;
  role: string;
  company: string;
  city: string;
  country: string;
  initials: string;
  hue: string;
  note: string;
  met: string;
  starred: boolean;
};

const initialPeople: Person[] = [
  { id: 1, name: "Mara Ellison", role: "Architect", company: "Fieldwork Studio", city: "Copenhagen", country: "Denmark", initials: "ME", hue: "clay", note: "Knows the small timber workshop near the canal. Send her the material study when it is ready.", met: "Form & Function dinner", starred: true },
  { id: 2, name: "Jonas Richter", role: "Creative Director", company: "Northline", city: "Copenhagen", country: "Denmark", initials: "JR", hue: "moss", note: "Building an independent print journal. Loves long walks and very strong coffee.", met: "Introduced by Mara", starred: false },
  { id: 3, name: "Aya Nakamura", role: "Gallery Curator", company: "Kite House", city: "Tokyo", country: "Japan", initials: "AN", hue: "ochre", note: "Curates emerging ceramicists. Visiting Copenhagen this autumn.", met: "Opening night at Kite House", starred: true },
  { id: 4, name: "Theo Martin", role: "Founder", company: "Common Ground", city: "Lisbon", country: "Portugal", initials: "TM", hue: "plum", note: "Working on a neighborhood food project; has a lovely list of places in Alfama.", met: "Through the Lisbon table", starred: false },
  { id: 5, name: "Leila Haddad", role: "Editor", company: "The New Cartography", city: "London", country: "United Kingdom", initials: "LH", hue: "gold", note: "Interested in stories about the people shaping public spaces.", met: "Bookshop talk in Soho", starred: false },
  { id: 6, name: "Sam Okafor", role: "Landscape Designer", company: "Open Ground", city: "London", country: "United Kingdom", initials: "SO", hue: "sea", note: "Could connect us with the garden team at the Barbican.", met: "A friend of Leila’s", starred: true },
  { id: 7, name: "Lucía Reyes", role: "Independent Publisher", company: "Casa Papel", city: "Mexico City", country: "Mexico", initials: "LR", hue: "rose", note: "Makes beautifully tactile books about cities and the people who live in them.", met: "Small press fair", starred: false },
  { id: 8, name: "Nico Bell", role: "Photographer", company: "Independent", city: "Unplaced", country: "", initials: "NB", hue: "slate", note: "Add a city next time you speak. Last email mentioned an upcoming move.", met: "Through a mutual friend", starred: false },
];

const cityMeta: Record<string, { country: string; coordinates: string; tone: string }> = {
  Copenhagen: { country: "Denmark", coordinates: "55° 41′ N · 12° 34′ E", tone: "clay" },
  London: { country: "United Kingdom", coordinates: "51° 30′ N · 00° 07′ W", tone: "moss" },
  Tokyo: { country: "Japan", coordinates: "35° 41′ N · 139° 41′ E", tone: "gold" },
  Lisbon: { country: "Portugal", coordinates: "38° 43′ N · 09° 08′ W", tone: "plum" },
  "Mexico City": { country: "Mexico", coordinates: "19° 26′ N · 99° 08′ W", tone: "rose" },
  Unplaced: { country: "City to be added", coordinates: "—", tone: "slate" },
};

export default function AtlasIndex() {
  const [people, setPeople] = useState(initialPeople);
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState("All places");
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(1);
  const [sortByPlace, setSortByPlace] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({ name: "", role: "", company: "", city: "", note: "" });

  const places = useMemo(() => [...new Set(people.map((person) => person.city))].sort((a, b) => a.localeCompare(b)), [people]);
  const filtered = useMemo(() => people
    .filter((person) => {
      const haystack = `${person.name} ${person.role} ${person.company} ${person.city} ${person.country}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase())
        && (place === "All places" || person.city === place)
        && (!savedOnly || person.starred);
    })
    .sort((a, b) => sortByPlace ? a.city.localeCompare(b.city) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name)), [people, query, place, savedOnly, sortByPlace]);
  const selected = people.find((person) => person.id === selectedId) ?? null;
  const grouped = places.map((city) => ({ city, people: filtered.filter((person) => person.city === city) })).filter((group) => group.people.length);
  const savedCount = people.filter((person) => person.starred).length;

  const toggleSaved = (id: number) => setPeople((current) => current.map((person) => person.id === id ? { ...person, starred: !person.starred } : person));
  const clearFilters = () => { setQuery(""); setPlace("All places"); setSavedOnly(false); };
  const openModal = (mode: "add" | "edit") => {
    setDraft(mode === "edit" && selected
      ? { name: selected.name, role: selected.role, company: selected.company, city: selected.city === "Unplaced" ? "" : selected.city, note: selected.note }
      : { name: "", role: "", company: "", city: "", note: "" });
    setModal(mode);
  };
  const savePerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    if (modal === "edit" && selected) {
      const name = draft.name.trim();
      setPeople((current) => current.map((person) => person.id === selected.id ? {
        ...person, ...draft, name, city: draft.city.trim() || "Unplaced",
        country: cityMeta[draft.city.trim()]?.country ?? "", initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      } : person));
      setNotice(`${name}’s details are up to date.`);
    } else {
      const name = draft.name.trim();
      const next: Person = {
        id: Date.now(), ...draft, name, city: draft.city.trim() || "Unplaced",
        country: cityMeta[draft.city.trim()]?.country ?? "", initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
        hue: "clay", note: draft.note.trim() || "A new connection to remember. Add a little context while it is still fresh.",
        met: "Just added", starred: false,
      };
      setPeople((current) => [...current, next]);
      setSelectedId(next.id);
      setNotice(`${name} added to your atlas.`);
    }
    setModal(null);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <main className="atlas-index">
      <header className="ai-topbar">
        <div className="ai-brand">
          <span className="ai-seal"><Compass size={19} strokeWidth={1.35} /><i /></span>
          <span className="ai-wordmark">Map Rolodex<small>A field guide to your people</small></span>
        </div>
        <div className="ai-breadcrumb"><span>PERSONAL ATLAS</span><b>/</b><strong>CONNECTIONS</strong></div>
        <div className="ai-top-actions">
          <button className={`ai-saved ${savedOnly ? "is-active" : ""}`} onClick={() => setSavedOnly((value) => !value)} aria-pressed={savedOnly}>
            <Star size={14} fill={savedOnly ? "currentColor" : "none"} /> Saved <span>{String(savedCount).padStart(2, "0")}</span>
          </button>
          <button className="ai-add-button" onClick={() => openModal("add")}><Plus size={15} /> New connection</button>
          <button className="ai-avatar-button" aria-label="Account: You" onClick={() => { setNotice("Your atlas is private to you."); window.setTimeout(() => setNotice(""), 2500); }}>Y</button>
        </div>
      </header>

      <div className="ai-workspace">
        <aside className="ai-rail">
          <div className="ai-rail-intro">
            <span className="ai-kicker">THE DIRECTORY <i /></span>
            <h1>Your world,<br /><em>by place.</em></h1>
            <p>A living index of the people who make your world feel smaller.</p>
            <div className="ai-total"><strong>{String(people.length).padStart(2, "0")}</strong><span>CONNECTIONS<br />ACROSS {String(places.length - (places.includes("Unplaced") ? 1 : 0)).padStart(2, "0")} CITIES</span></div>
          </div>
          <nav className="ai-place-nav" aria-label="Filter contacts by place">
            <div className="ai-nav-label"><span>PLACES</span><span>{String(places.length).padStart(2, "0")}</span></div>
            <button className={`ai-place-link ${place === "All places" ? "active" : ""}`} onClick={() => setPlace("All places")}><span className="ai-place-marker all" /><span>All places</span><small>{String(people.length).padStart(2, "0")}</small></button>
            {places.map((city) => <button key={city} className={`ai-place-link ${place === city ? "active" : ""}`} onClick={() => setPlace(city)}>
              <span className={`ai-place-marker ${cityMeta[city]?.tone ?? "slate"}`} />
              <span className="ai-place-name">{city}<small>{cityMeta[city]?.country ?? "City to be added"}</small></span>
              <small>{String(people.filter((person) => person.city === city).length).padStart(2, "0")}</small>
            </button>)}
          </nav>
          <div className="ai-rail-foot"><span className="ai-lock-mark">◎</span><span>PRIVATE BY NATURE<small>Only you can see this atlas.</small></span></div>
        </aside>

        <section className="ai-directory" aria-label="Connections directory">
          <div className="ai-directory-heading">
            <div><span className="ai-kicker">AN INDEX OF YOUR WORLD</span><h2>{place === "All places" ? "The directory" : place}<sup>{String(filtered.length).padStart(2, "0")}</sup></h2></div>
            <button className="ai-reset" onClick={clearFilters}>Reset view <ArrowUpRight size={13} /></button>
          </div>
          <div className="ai-toolbar">
            <label className="ai-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a person, place, or practice…" aria-label="Search contacts" />{query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></button>}<kbd>⌘ K</kbd></label>
            <button className="ai-sort" onClick={() => setSortByPlace((value) => !value)}><SlidersHorizontal size={14} /><span>ORDER</span><strong>{sortByPlace ? "PLACE" : "NAME"}</strong><ArrowDownUp size={13} /></button>
          </div>
          <div className="ai-list-content">
            {grouped.length === 0 ? <div className="ai-empty"><span className="ai-empty-icon"><Search size={20} /></span><h3>No connections found.</h3><p>Try another name or choose a different place.</p><button onClick={clearFilters}>Clear filters</button></div> : grouped.map((group, index) => <section className="ai-city-group" key={group.city}>
              <div className="ai-city-heading">
                <span className={`ai-city-number ${cityMeta[group.city]?.tone ?? "slate"}`}>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{group.city}</h3><small>{cityMeta[group.city]?.country ?? "City to be added"}</small></div>
                <span className="ai-coordinates">{cityMeta[group.city]?.coordinates ?? "—"}</span>
                <span className="ai-rule" />
                <span className="ai-city-count">{String(group.people.length).padStart(2, "0")} {group.people.length === 1 ? "PERSON" : "PEOPLE"}</span>
              </div>
              <div className="ai-people">
                {group.people.map((person) => <article className={`ai-person-row ${person.id === selectedId ? "selected" : ""}`} key={person.id}>
                  <button className="ai-person-select" onClick={() => setSelectedId(person.id)} aria-label={`View ${person.name}`}>
                    <span className={`ai-monogram ${person.hue}`}>{person.initials}</span>
                    <span className="ai-person-main"><strong>{person.name}</strong><small>{person.role}<i>·</i>{person.company}</small></span>
                    <span className="ai-met"><small>FIRST CAME ACROSS</small><span>{person.met}</span></span>
                  </button>
                  <button className={`ai-star ${person.starred ? "saved" : ""}`} onClick={() => toggleSaved(person.id)} aria-label={person.starred ? `Remove ${person.name} from saved` : `Save ${person.name}`} aria-pressed={person.starred}><Star size={16} fill={person.starred ? "currentColor" : "none"} /></button>
                  <button className="ai-open-person" onClick={() => setSelectedId(person.id)} aria-label={`Open ${person.name}`}><ArrowUpRight size={15} /></button>
                </article>)}
              </div>
            </section>)}
            {filtered.length > 0 && <button className="ai-add-row" onClick={() => openModal("add")}><Plus size={14} /> Add a connection to this index</button>}
          </div>
          <footer className="ai-directory-foot"><span>AN ATLAS MADE OF PEOPLE, NOT PINPOINTS.</span><span>MAP ROLODEX <i>·</i> PRIVATE EDITION</span></footer>
        </section>

        <aside className="ai-person-card" aria-label="Selected connection">
          {selected ? <>
            <div className="ai-card-top"><span className="ai-kicker">FIELD NOTE <b>/</b> {String(selected.id).padStart(2, "0")}</span><button className="ai-card-menu" aria-label="More details" onClick={() => openModal("edit")}><span>•••</span></button></div>
            <div className="ai-portrait-block">
              <div className={`ai-portrait ${selected.hue}`}><span>{selected.initials}</span><i className="ai-orbit orbit-a" /><i className="ai-orbit orbit-b" /><i className="ai-orbit orbit-c" /></div>
              <span className="ai-portrait-caption">CONNECTION No. {String(selected.id).padStart(3, "0")}</span>
            </div>
            <div className="ai-card-name"><h2>{selected.name.split(" ")[0]}<br /><em>{selected.name.split(" ").slice(1).join(" ")}</em></h2><button className={`ai-card-star ${selected.starred ? "saved" : ""}`} onClick={() => toggleSaved(selected.id)} aria-label={selected.starred ? "Remove saved person" : "Save person"}><Star size={18} fill={selected.starred ? "currentColor" : "none"} /></button></div>
            <p className="ai-card-role">{selected.role} <span>at</span> {selected.company}</p>
            <div className="ai-card-place"><MapPin size={16} /><span><small>BASED IN</small><strong>{selected.city}{selected.country ? `, ${selected.country}` : ""}</strong></span><ChevronDown size={14} /></div>
            <section className="ai-note">
              <div><span>IN THE MARGINS</span><i>✳</i></div>
              <p>“{selected.note}”</p>
              <small>YOUR PRIVATE NOTE</small>
            </section>
            <div className="ai-first-met"><span>FIRST CAME ACROSS</span><strong>{selected.met}</strong></div>
            <div className="ai-card-actions"><button className="ai-write" onClick={() => { setNotice(`A note for ${selected.name} is ready to write.`); window.setTimeout(() => setNotice(""), 2600); }}>Write a note <ArrowUpRight size={15} /></button><button className="ai-edit" onClick={() => openModal("edit")}>Edit details</button></div>
            <div className="ai-card-stamp"><span>MR</span><small>KEPT CLOSE,<br />WHEREVER THEY ARE.</small><Check size={15} /></div>
          </> : <div className="ai-card-empty"><span>◎</span><h3>Choose a connection</h3><p>Select a person in the directory to see the story behind the place.</p></div>}
        </aside>
      </div>

      {notice && <div className="ai-toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={14} /></button></div>}
      {modal && <div className="ai-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
        <form className="ai-modal" onSubmit={savePerson}>
          <button type="button" className="ai-modal-close" onClick={() => setModal(null)} aria-label="Close"><X size={17} /></button>
          <span className="ai-kicker">{modal === "edit" ? "UPDATE YOUR FIELD NOTE" : "A NEW PAGE IN YOUR ATLAS"}</span>
          <h2>{modal === "edit" ? <>Keep the details<br /><em>close.</em></> : <>Who did you<br /><em>meet?</em></>}</h2>
          <label>Name<input autoFocus required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="First and last name" /></label>
          <div className="ai-form-pair"><label>Role<input value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} placeholder="What they do" /></label><label>Company<input value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} placeholder="Where they work" /></label></div>
          <label>City<input list="atlas-index-cities" value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} placeholder="Leave blank to add later" /><datalist id="atlas-index-cities">{places.filter((city) => city !== "Unplaced").map((city) => <option key={city} value={city} />)}</datalist></label>
          <label>Something to remember<textarea value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} placeholder="A detail worth keeping…" rows={3} /></label>
          <button type="submit" className="ai-submit">{modal === "edit" ? "Save details" : "Add to the directory"} <ArrowUpRight size={15} /></button>
          <p className="ai-modal-foot">Start with what you know. The rest can find its way in later.</p>
        </form>
      </div>}
    </main>
  );
}