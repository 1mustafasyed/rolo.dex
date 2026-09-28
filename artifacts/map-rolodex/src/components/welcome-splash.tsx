type WelcomeSplashProps = {
  covered: boolean;
  exiting: boolean;
  mapSlow: boolean;
  onOpenAnyway: () => void;
};

export default function WelcomeSplash({ covered, exiting, mapSlow, onOpenAnyway }: WelcomeSplashProps) {
  return (
    <div
      className={`welcome-splash${exiting ? ' is-exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-hidden={covered || exiting}
      data-testid="welcome-splash"
    >
      <div className="welcome-scene">
        <div className="welcome-veil" aria-hidden="true" />
        <div className="welcome-grid" aria-hidden="true" />
        <div className="welcome-field" aria-hidden="true">
          {Array.from({ length: 12 }, (_, row) =>
            <div className="welcome-field-row" key={row}>
              {Array.from({ length: 32 }, (_, col) =>
                <span key={col}>{(row * 7 + col * 11) % 13 === 0 ? '✳' : '+'}</span>
              )}
            </div>
          )}
        </div>

        <div className="welcome-orbit" aria-hidden="true">
          <svg viewBox="0 0 780 780" fill="none">
            <circle cx="390" cy="390" r="340" className="orbit-ring orbit-ring-outer" />
            <circle cx="390" cy="390" r="264" className="orbit-ring orbit-ring-middle" />
            <circle cx="390" cy="390" r="184" className="orbit-ring orbit-ring-inner" />
            <circle cx="390" cy="390" r="77" className="orbit-ring orbit-ring-core" />
            <path d="M390 12v756M12 390h756" className="orbit-axis" />
            <path d="M390 390 220 178 576 163 656 390 486 622 267 594Z" className="orbit-route" />
            <path d="M199 46v20m-10-10h20M615 703v20m-10-10h20" className="orbit-axis" />
            <circle cx="220" cy="178" r="6" className="orbit-node" />
            <circle cx="576" cy="163" r="6" className="orbit-node" />
            <circle cx="656" cy="390" r="6" className="orbit-node" />
            <circle cx="486" cy="622" r="6" className="orbit-node" />
            <circle cx="267" cy="594" r="6" className="orbit-node" />
            <circle cx="390" cy="390" r="9" className="orbit-center" />
          </svg>
        </div>

        <main className="welcome-content">
          <div className="welcome-kicker"><span className="welcome-kicker-line" /> YOUR PEOPLE. YOUR PLACES.</div>
          <h1>
            <span className="welcome-type-window"><span className="welcome-type-line welcome-type-line-one">Welcome</span></span>
            <span className="welcome-type-window"><span className="welcome-type-line welcome-type-line-two">to your</span></span>
            <span className="welcome-type-window"><em className="welcome-type-line welcome-type-line-three">Rolodex<span className="welcome-period">.</span></em></span>
          </h1>
          <div className="welcome-title-rule" aria-hidden="true" />
        </main>
        {mapSlow && <div className="welcome-splash-wait">
          <p>The map is taking longer to load.</p>
          <button type="button" onClick={onOpenAnyway}>Open rolodex anyway</button>
        </div>}
      </div>
    </div>
  );
}