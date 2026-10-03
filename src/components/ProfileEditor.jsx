import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileBySlug, getInitials, isExternalUrl, normalizeUrl } from '../services/profileStorage';

export default function PublicProfile() {
  const { slug } = useParams();
  const profile = getProfileBySlug(slug || '');

  const linkButtons = useMemo(() => {
    if (!profile) return [];
    return (profile.links || []).filter((link) => link.enabled !== false && link.url);
  }, [profile]);

  if (!profile) {
    return (
      <main className="public-page shell-empty">
        <div className="public-card empty">
          <p className="eyebrow">404</p>
          <h1>Profile not found.</h1>
          <p>This customer profile does not exist or has been removed.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="public-page">
      <div className="public-card">
        <header className="public-header">
          <div className="brand-row">
            <span className="brand-wordmark">NIVO</span>
            <span className="mono micro">SIGNAL / 001</span>
          </div>
          <div className="header-meta">
            {profile.status && <span className="status-label">{profile.status}</span>}
            <span className="mono tiny">/01</span>
          </div>
        </header>

        <section className="public-hero">
          <div className="public-media-wrap">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="public-avatar" />
            ) : (
              <div className="public-avatar placeholder">{getInitials(profile.name)}</div>
            )}
          </div>

          <div className="public-meta-block">
            <p className="mono meta-top">/{profile.slug || 'profile'}</p>
            <h1>{profile.name}</h1>
            {profile.location && <p className="mono location">{profile.location}</p>}
            {profile.bio && <p className="bio">{profile.bio}</p>}
          </div>
        </section>

        <nav className="public-links" aria-label="Customer links">
          {linkButtons.map((link) => {
            const href = normalizeUrl(link.url || '');
            const isExternal = isExternalUrl(href);

            return (
              <a
                key={link.id}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer noopener' : undefined}
                className="public-link"
              >
                <span className="public-link-icon">{link.icon || link.title.slice(0, 2).toUpperCase()}</span>
                <span>{link.title}</span>
              </a>
            );
          })}
        </nav>

        <footer className="public-footer">
          <span className="mono tiny">NIVO</span>
          <span className="mono tiny">PROFILE</span>
        </footer>
      </div>
    </main>
  );
}
