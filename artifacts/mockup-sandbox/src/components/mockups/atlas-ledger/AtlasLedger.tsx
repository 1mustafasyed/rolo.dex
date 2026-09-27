import { useMemo, useState, type FormEvent } from "react";
import "./atlas-ledger.css";

type Person = { id: number; name: string; role: string; company: string; city: string; country: string; initials: string; color: string; note: string; met: string; starred: boolean };

const initialPeople: Person[] = [
  { id: 1, name: "Mara Ellison", role: "Architect", company: "Fieldwork Studio", city: "Copenhagen", country: "Denmark", initials: "ME", color: "#b85e47", note: "Knows the small timber workshop near the canal. Send her the material study when it is ready.", met: "At the Form & Function dinner", starred: true },
  { id: 2, name: "Jonas Richter", role: "Creative Director", company: "Northline", city: "Copenhagen", country: "Denmark", initials: "JR", color: "#627d69", note: "Building an independent print journal. Loves long walks and very strong coffee.", met: "Introduced by Mara", starred: false },
  { id: 3, name: "Aya Nakamura", role: "Gallery Curator", company: "Kite House", city: "Tokyo", country: "Japan", initials: "AN", color: "#bc785c", note: "Curates emerging ceramicists. Visiting Copenhagen this autumn.", met: "On the opening night", starred: true },
  { id: 4, name: "Theo Martin", role: "Founder", company: "Common Ground", city: "Lisbon", country: "Portugal", initials: "TM", color: "#7b7191", note: "Working on a neighborhood food project; has a lovely list of places in Alfama.", met: "Through the Lisbon table", starred: false },
  { id: 5, name: "Leila Haddad", role: "Editor", company: "The New Cartography", city: "London", country: "United Kingdom", initials: "LH", color: "#b8954e", note: "Interested in stories about the people shaping public spaces.", met: "At a bookshop talk", starred: false },
  { id: 6, name: "Sam Okafor", role: "Landscape Designer", company: "Open Ground", city: "London", country: "United Kingdom", initials: "SO", color: "#527f82", note: "Could connect us with the garden team at the Barbican.", met: "A friend of Leila's", starred: true },
  { id: 7, name: "Lucía Reyes", role: "Independent Publisher", company: "Casa Papel", city: "Mexico City", country: "Mexico", initials: "LR", color: "#a86173", note: "Makes beautifully tactile books about cities and the people who live in them.", met: "At a small press fair", starred: false },
  { id: 8, name: "Nico Bell", role: "Photographer", company: "—", city: "Unplaced", country: "", initials: "NB", color: "#6a7991", note: "Add a city next time you speak. Last email mentioned an upcoming move.", met: "Through a mutual friend", starred: false },
];

const cities = [
  { name: "Copenhagen", country: "Denmark", count: 2, mark: "55°41′N", tone: "coral" },
  { name: "London", country: "United Kingdom", count: 2, mark: "51°30′N", tone: "sage" },
  { name: "Tokyo", country: "Japan", count: 1, mark: "35°41′N", tone: "ochre" },
  { name: "Lisbon", country: "Portugal", count: 1, mark: "38°43′N", tone: "lilac" },
  { name: "Mexico City", country: "Mexico", count: 1, mark: "19°26′N", tone: "rose" },
];

export default function AtlasLedger() {
  const [people, setPeople] = useState(initialPeople);
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("All places");
  const [selected, setSelected] = useState<Person | null>(initialPeople[0]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [cityDraft, setCityDraft] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => people.filter(person => {
    const matchesQuery = `${person.name} ${person.role} ${person.company} ${person.city}`.toLowerCase().includes(search.toLowerCase());
    return matchesQuery && (activeCity === "All places" || person.city === activeCity) && (!favoritesOnly || person.starred);
  }), [people, search, activeCity, favoritesOnly]);
  const grouped = cities.map(city => ({ ...city, people: filtered.filter(person => person.city === city.name) })).filter(city => city.people.length > 0);

  const toggleStar = (person: Person) => setPeople(current => current.map(item => item.id === person.id ? { ...item, starred: !item.starred } : item));
  const addPerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nameDraft.trim()) return;
    const parts = nameDraft.trim().split(/\s+/);
    const next: Person = {
      id: Date.now(), name: nameDraft.trim(), role: "New connection", company: "Add a detail later",
      city: cityDraft.trim() || "Unplaced", country: "", initials: parts.slice(0, 2).map(part => part[0]).join("").toUpperCase(),
      color: "#627d69", note: "A new connection to remember. Add a little context while it is still fresh.",
      met: "Just added", starred: false,
    };
    setPeople(current => [...current, next]);
    setSelected(next); setActiveCity("All places"); setSearch(""); setNameDraft(""); setCityDraft(""); setShowAdd(false);
    setNotice(`${next.name} added to your atlas`);
    window.setTimeout(() => setNotice(""), 2800);
  };

  return (
    <main className="ledger">
      <header className="ledger-head">
        <div className="ledger-brand">
          <div className="ledger-seal"><span>MR</span><i /></div>
          <div><div className="ledger-wordmark">Map Rolodex</div><div className="ledger-subbrand">A field guide to your people</div></div>
        </div>
        <div className="ledger-crumb"><span>PERSONAL ATLAS</span><b>/</b><span>CONNECTIONS</span></div>
        <div className="ledger-actions">
          <button className={`saved-toggle ${favoritesOnly ? "selected" : ""}`} onClick={() => setFavoritesOnly(value => !value)} aria-pressed={favoritesOnly}>
            <span className="star-glyph">{favoritesOnly ? "★" : "☆"}</span> Saved <span className="saved-count">{people.filter(person => person.starred).length}</span>
          </button>
          <button className="add-person" onClick={() => setShowAdd(true)}><span>＋</span> New connection</button>
          <button className="profile-chip" aria-label="Profile menu" onClick={() => setNotice("Signed in as you@somewhere.studio")}><span>Y</span><i>⌄</i></button>
        </div>
      </header>

      <div className="ledger-body">
        <aside className="place-rail">
          <div className="rail-top">
            <span className="micro-label">THE DIRECTORY</span>
            <h1>People,<br /><em>by place.</em></h1>
            <p>A living index of the people who make your world feel smaller.</p>
            <div className="rail-total"><span className="total-number">{people.length.toString().padStart(2, "0")}</span><span>CONNECTIONS<br />ACROSS {cities.length} CITIES</span></div>
          </div>
          <div className="place-list">
            <div className="place-list-head"><span>PLACES</span><span>{cities.length.toString().padStart(2, "0")}</span></div>
            <button className={`place-item all-places ${activeCity === "All places" ? "active" : ""}`} onClick={() => setActiveCity("All places")}>
              <span className="place-dot" /><span className="place-name">All places</span><span className="place-count">{people.length.toString().padStart(2, "0")}</span>
            </button>
            {cities.map(city => <button key={city.name} className={`place-item ${activeCity === city.name ? "active" : ""}`} onClick={() => setActiveCity(city.name)}>
              <span className={`place-dot ${city.tone}`} /><span className="place-label"><span className="place-name">{city.name}</span><small>{city.country}</small></span><span className="place-count">{city.count.toString().padStart(2, "0")}</span>
            </button>)}
            <button className={`place-item unplaced ${activeCity === "Unplaced" ? "active" : ""}`} onClick={() => setActiveCity("Unplaced")}>
              <span className="place-dot hollow" /><span className="place-label"><span className="place-name">Unplaced</span><small>Waiting for a city</small></span><span className="place-count">{people.filter(person => person.city === "Unplaced").length.toString().padStart(2, "0")}</span>
            </button>
          </div>
          <div className="rail-foot"><span className="orbit-icon">◎</span><span>PRIVATE BY NATURE<br /><small>Only you can see this atlas.</small></span></div>
        </aside>

        <section className="directory">
          <div className="directory-heading">
            <div><div className="section-kicker">{activeCity === "All places" ? "AN INDEX OF YOUR WORLD" : `PLACE / ${activeCity.toUpperCase()}`}</div><h2>{activeCity === "All places" ? "The directory" : activeCity}<sup>{filtered.length.toString().padStart(2, "0")}</sup></h2></div>
            <div className="directory-meta"><span>LAST ARRANGED</span><strong>JUST NOW</strong><span className="meta-rule" /><button onClick={() => { setSearch(""); setActiveCity("All places"); setFavoritesOnly(false); }}>Reset view ↗</button></div>
          </div>
          <div className="directory-toolbar">
            <label className="search-field"><span className="search-icon">⌕</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a person, place, or practice…" aria-label="Search people" /><kbd>⌘ K</kbd></label>
            <div className="sort-label">ORDER <button onClick={() => setNotice("Directory is arranged by place, then name.")}>PLACE <span>⌄</span></button></div>
          </div>
          <div className="directory-content">
            {grouped.length === 0 && filtered.filter(person => person.city === "Unplaced").length === 0 ? <div className="no-results"><span>⌕</span><h3>No connections found.</h3><p>Try another name or choose a different place.</p><button onClick={() => { setSearch(""); setActiveCity("All places"); setFavoritesOnly(false); }}>Clear filters</button></div> : <>
              {grouped.map((city, index) => <section className="city-group" key={city.name}>
                <div className="city-group-head"><span className={`city-index ${city.tone}`}>0{index + 1}</span><div className="city-title-wrap"><h3>{city.name}</h3><span>{city.country}</span></div><span className="city-coordinate">{city.mark}</span><span className="city-line" /><span className="city-people-count">{city.people.length} {city.people.length === 1 ? "PERSON" : "PEOPLE"}</span></div>
                <div className="person-list">{city.people.map(person => <button key={person.id} className={`directory-person ${selected?.id === person.id ? "current" : ""}`} onClick={() => setSelected(person)}>
                  <span className="person-monogram" style={{ backgroundColor: person.color }}>{person.initials}</span>
                  <span className="directory-person-main"><strong>{person.name}</strong><small>{person.role} <i>·</i> {person.company}</small></span>
                  <span className="person-met"><small>CONNECTED THROUGH</small><span>{person.met}</span></span>
                  <span className="person-star" onClick={event => { event.stopPropagation(); toggleStar(person); }}>{person.starred ? "★" : "☆"}</span>
                  <span className="person-arrow">↗</span>
                </button>)}</div>
              </section>)}
              {filtered.filter(person => person.city === "Unplaced").length > 0 && <section className="unplaced-group"><div className="unplaced-heading"><span>WITHOUT AN ADDRESS</span><span>{filtered.filter(person => person.city === "Unplaced").length} PERSON</span></div>{filtered.filter(person => person.city === "Unplaced").map(person => <button className="directory-person" key={person.id} onClick={() => setSelected(person)}><span className="person-monogram" style={{ backgroundColor: person.color }}>{person.initials}</span><span className="directory-person-main"><strong>{person.name}</strong><small>{person.role} <i>·</i> {person.company}</small></span><span className="person-met"><small>CONNECTED THROUGH</small><span>{person.met}</span></span><span className="person-star" onClick={event => { event.stopPropagation(); toggleStar(person); }}>{person.starred ? "★" : "☆"}</span><span className="person-arrow">↗</span></button>)}</section>}
              <button className="add-row" onClick={() => setShowAdd(true)}><span>＋</span> Add a connection to this index</button>
            </>}
          </div>
          <footer className="directory-foot"><span>AN ATLAS MADE OF PEOPLE, NOT PINPOINTS.</span><span>MAP ROLODEX <i>·</i> 2024</span></footer>
        </section>

        <aside className="person-card">
          {selected ? <>
            <div className="card-topline"><span className="micro-label">FIELD NOTE / {String(selected.id).padStart(2, "0")}</span><button className="more-button" onClick={() => setNotice("More contact actions coming soon.")}>•••</button></div>
            <div className="portrait-block"><div className="portrait-ring" style={{ borderColor: selected.color }}><span style={{ backgroundColor: selected.color }}>{selected.initials}</span><i className="portrait-orbit orbit-one" /><i className="portrait-orbit orbit-two" /></div><span className="portrait-coordinate">CONNECTION No. {String(selected.id).padStart(3, "0")}</span></div>
            <div className="card-name"><h2>{selected.name.split(" ")[0]}<br /><em>{selected.name.split(" ").slice(1).join(" ")}</em></h2><button aria-label={selected.starred ? "Remove saved person" : "Save person"} onClick={() => toggleStar(selected)}>{selected.starred ? "★" : "☆"}</button></div>
            <p className="card-role">{selected.role} <span>at</span> {selected.company}</p>
            <div className="card-place"><span className="card-pin">⌖</span><div><small>BASED IN</small><strong>{selected.city}{selected.country ? `, ${selected.country}` : ""}</strong></div><span className="place-arrow">↗</span></div>
            <div className="note-section"><div className="note-label"><span>IN THE MARGINS</span><span>✳</span></div><p>“{selected.note}”</p><small>YOUR PRIVATE NOTE</small></div>
            <div className="met-section"><span>FIRST CAME ACROSS</span><strong>{selected.met}</strong></div>
            <div className="card-buttons"><button className="write-button" onClick={() => setNotice(`A note for ${selected.name} is ready to write.`)}>Write a note <span>↗</span></button><button className="edit-button" onClick={() => setNotice(`Editing ${selected.name} is not available in this preview.`)}>Edit details</button></div>
            <div className="card-footer"><span className="footer-stamp">MR</span><span>KEPT CLOSE,<br />WHEREVER THEY ARE.</span></div>
          </> : <div className="card-empty"><span>◎</span><h3>Choose a connection</h3><p>Select a person in the directory to see the story behind the place.</p></div>}
        </aside>
      </div>
      {notice && <div className="ledger-toast" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}
      {showAdd && <div className="ledger-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setShowAdd(false); }}><form className="add-modal" onSubmit={addPerson}><button className="modal-close" type="button" onClick={() => setShowAdd(false)}>×</button><span className="micro-label">A NEW PAGE IN YOUR ATLAS</span><h2>Who did you<br /><em>meet?</em></h2><label>Name<input autoFocus value={nameDraft} onChange={event => setNameDraft(event.target.value)} placeholder="First and last name" required /></label><label>City, if you know it<input value={cityDraft} onChange={event => setCityDraft(event.target.value)} placeholder="Leave blank to add later" /></label><button className="add-person modal-submit" type="submit">Add to the directory <span>↗</span></button><p>Start with a name. The rest can find its way in later.</p></form></div>}
    </main>
  );
}