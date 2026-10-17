import type { AnimationEvent, CSSProperties } from 'react';
import { tokens } from '@workspace/map-rolodex-design-system/tokens';

const dark = tokens.color.dark;

/** Scoped token variables; apply to every entrance pane root (welcome, rust layer). */
export const entranceTheme = {
  '--entrance-background': dark.background,
  '--entrance-surface': dark.card,
  '--entrance-sidebar': dark.sidebar,
  '--entrance-foreground': dark.foreground,
  '--entrance-muted': dark.mutedForeground,
  '--entrance-primary': dark.primary,
  '--entrance-primary-foreground': dark.primaryForeground,
  '--entrance-accent': dark.accent,
  '--entrance-border': dark.border,
  '--entrance-radius': tokens.radius,
  '--entrance-font-sans': tokens.fontFamily.sans.join(', '),
  '--entrance-font-serif': tokens.fontFamily.serif.map((f) => (f.includes(' ') ? `"${f}"` : f)).join(', '),
  '--entrance-font-mono': tokens.fontFamily.mono.join(', '),
} as CSSProperties;

type WelcomeSplashProps = {
  covered: boolean;
  exiting: boolean;
  revealing: boolean;
  onRouteComplete: () => void;
  onExitComplete: () => void;
  exitDurationMs: number;
  revealDurationMs: number;
  reducedMotion: boolean;
  entering: boolean;
  onEntryComplete: () => void;
  entryDurationMs: number;
};

export default function WelcomeSplash({
  covered, exiting, revealing, onRouteComplete, onExitComplete,
  exitDurationMs, revealDurationMs, reducedMotion,
  entering, onEntryComplete, entryDurationMs,
}: WelcomeSplashProps) {
  const hidden = covered || exiting;
  const style = {
    ...entranceTheme,
    '--entrance-reveal-duration': `${revealDurationMs}ms`,
    '--entrance-exit-duration': `${exitDurationMs}ms`,
    '--entrance-entry-duration': `${entryDurationMs}ms`,
  } as CSSProperties;

  const handleRouteEnd = (e: AnimationEvent<SVGPathElement>) => {
    if (!revealing || exiting || e.target !== e.currentTarget) return;
    if (e.animationName === 'welcome-route') onRouteComplete();
  };

  const handleRootEnd = (e: AnimationEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (entering && e.animationName === 'login-rise-up') {
      onEntryComplete();
      return;
    }
    if (e.animationName !== 'login-swipe-up' && e.animationName !== 'login-fade-out') return;
    if (exiting) onExitComplete();
  };

  return (
    <div
      className={`welcome-splash${covered && !entering ? ' is-waiting' : ''}${entering ? ' is-entering' : ''}${exiting ? ' is-exiting' : ''}${revealing ? ' is-revealing' : ''}${!covered && (!revealing || exiting) ? ' is-readable' : ''}${reducedMotion ? ' is-reduced' : ''}`}
      style={style}
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
      onAnimationEnd={handleRootEnd}
      data-testid="welcome-splash"
    >
      <div className="welcome-scene">
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
            <path d="M390 390 220 178 576 163 656 390 486 622 267 594Z" className="orbit-route" onAnimationEnd={handleRouteEnd} />
            <path d="M199 46v20m-10-10h20M615 703v20m-10-10h20" className="orbit-axis" />
            <circle cx="220" cy="178" r="6" className="orbit-node" />
            <circle cx="576" cy="163" r="6" className="orbit-node" />
            <circle cx="656" cy="390" r="6" className="orbit-node" />
            <circle cx="486" cy="622" r="6" className="orbit-node" />
            <circle cx="267" cy="594" r="6" className="orbit-node" />
            <circle cx="390" cy="390" r="9" className="orbit-center" />
          </svg>
        </div>

        <main className="welcome-content" role="status" aria-live="polite">
          <div className="welcome-kicker"><span className="welcome-kicker-line" /> YOUR PEOPLE. YOUR PLACES.</div>
          <h1 aria-label="Welcome to your Rolodex">
            <span className="welcome-type-window" aria-hidden="true"><span className="welcome-type-line welcome-type-line-one">Welcome</span></span>
            <span className="welcome-type-window" aria-hidden="true"><span className="welcome-type-line welcome-type-line-two">to your</span></span>
            <span className="welcome-type-window" aria-hidden="true"><em className="welcome-type-line welcome-type-line-three">Rolodex<span className="welcome-period">.</span></em></span>
          </h1>
          <div className="welcome-title-rule" aria-hidden="true" />
        </main>
      </div>
    </div>
  );
}
