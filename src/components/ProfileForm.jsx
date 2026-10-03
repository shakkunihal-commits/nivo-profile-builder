import { Link } from 'react-router-dom';

export default function ProfileList({ profiles, onView, onEdit, onDuplicate, onDelete }) {
  if (!profiles.length) {
    return (
      <div className="empty-state">
        <p className="eyebrow">No profiles yet</p>
        <h3>Start by creating a customer profile.</h3>
      </div>
    );
  }

  return (
    <div className="list-table" aria-label="Profile list">
      <div className="list-head row-grid">
        <span>Name</span>
        <span>Slug</span>
        <span>Links</span>
        <span>Created</span>
        <span>Updated</span>
        <span>Actions</span>
      </div>

      {profiles.map((profile) => (
        <div className="list-row row-grid" key={profile.id}>
          <div className="cell-name">
            <span className="cell-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} />
              ) : (
                <span>{profile.name?.slice(0, 1).toUpperCase() || 'N'}</span>
              )}
            </span>
            <div>
              <strong>{profile.name || 'Unnamed profile'}</strong>
              {profile.location && <small>{profile.location}</small>}
            </div>
          </div>

          <span className="mono">/{profile.slug || 'profile'}</span>
          <span>{Array.isArray(profile.links) ? profile.links.filter((link) => link.enabled !== false).length : 0}</span>
          <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
          <span>{new Date(profile.updatedAt).toLocaleDateString()}</span>

          <div className="table-actions">
            <Link to={`/admin/profiles/${profile.id}`} className="inline-action">
              Edit
            </Link>
            <button type="button" className="inline-action" onClick={() => onView(profile.slug)}>
              View
            </button>
            <button type="button" className="inline-action" onClick={() => onDuplicate(profile.id)}>
              Duplicate
            </button>
            <button type="button" className="inline-action danger" onClick={() => onDelete(profile.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
