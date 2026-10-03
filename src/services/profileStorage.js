import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import ProfileList from './ProfileList';
import {
  deleteProfile,
  duplicateProfile,
  getProfiles,
  getProfileBySlug,
} from '../services/profileStorage';

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const profiles = getProfiles();

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return profiles;

    return profiles.filter((profile) => {
      const haystack = `${profile.name} ${profile.slug} ${profile.location || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [profiles, search]);

  const handleDuplicate = (id) => {
    const duplicated = duplicateProfile(id);
    if (duplicated) {
      navigate(`/admin/profiles/${duplicated.id}`);
    }
  };

  const handleView = (slug) => {
    navigate(`/p/${slug}`);
  };

  const handleDelete = (id) => {
    deleteProfile(id);
    navigate(0);
  };

  return (
    <div className="page-shell admin-shell">
      <header className="topbar topbar-admin">
        <div className="brand-block whitespace-left">
          <span className="brand-wordmark">NIVO</span>
          <span className="mono">/ dashboard</span>
        </div>
        <Link to="/admin/profiles/new" className="nav-link">
          <Button type="button">+ New profile</Button>
        </Link>
      </header>

      <main className="shell-width admin-panel">
        <section className="panel">
          <div className="panel-header dashboard-header">
            <div>
              <p className="eyebrow">Admin</p>
              <h1>Customer profiles</h1>
            </div>
            <div className="search-wrap">
              <label htmlFor="profile-search" className="field inline-field">
                <span className="field-label sr-only">Search profiles</span>
                <input
                  id="profile-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search profiles"
                />
              </label>
            </div>
          </div>

          <ProfileList
            profiles={filteredProfiles}
            onView={handleView}
            onEdit={(id) => navigate(`/admin/profiles/${id}`)}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}
