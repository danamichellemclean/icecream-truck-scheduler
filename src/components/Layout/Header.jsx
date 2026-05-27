import branding from '../../config/branding';
import './Layout.css';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        {branding.logo ? (
          <img src={branding.logo} alt={branding.businessName} className="header-logo" />
        ) : (
          <span className="header-emoji" aria-hidden="true">{branding.logoEmoji}</span>
        )}
        <div className="header-text">
          <h1 className="header-title">{branding.businessName}</h1>
          <p className="header-tagline">{branding.tagline}</p>
        </div>
      </div>
    </header>
  );
}
