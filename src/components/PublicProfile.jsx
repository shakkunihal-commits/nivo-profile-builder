import { useMemo } from 'react';
import { PRESET_LINKS, slugify } from '../services/profileStorage';

export default function ProfileForm({ profile, onProfileChange, onSlugChange, onAddLink, onLinkChange }) {
  const namePreview = useMemo(() => slugify(profile.name || 'profile'), [profile.name]);

  return (
    <div className="profile-form">
      <div className="form-grid two-up">
        <label className="field">
          <span className="field-label">Customer name</span>
          <input
            type="text"
            value={profile.name}
            onChange={(event) => onProfileChange('name', event.target.value)}
            placeholder="John Doe"
          />
        </label>

        <label className="field">
          <span className="field-label">Username / slug</span>
          <input
            type="text"
            value={profile.slug || namePreview}
            onChange={(event) => onSlugChange(event.target.value)}
            placeholder="john-doe"
          />
        </label>
      </div>

      <label className="field">
        <span className="field-label">Short bio</span>
        <textarea
          rows="3"
          value={profile.bio}
          onChange={(event) => onProfileChange('bio', event.target.value)}
          placeholder="Creator / Music / Visual storytelling"
        />
      </label>

      <div className="form-grid two-up">
        <label className="field">
          <span className="field-label">Profile image / avatar</span>
          <input
            type="url"
            value={profile.avatar}
            onChange={(event) => onProfileChange('avatar', event.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </label>

        <label className="field">
          <span className="field-label">Location</span>
          <input
            type="text"
            value={profile.location}
            onChange={(event) => onProfileChange('location', event.target.value)}
            placeholder="London, UK"
          />
        </label>
      </div>

      <label className="field">
        <span className="field-label">Status label</span>
        <input
          type="text"
          value={profile.status || ''}
          onChange={(event) => onProfileChange('status', event.target.value)}
          placeholder="LIVE"
        />
      </label>

      <div className="links-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Links</p>
            <h3>Social and contact links</h3>
          </div>
          <button type="button" className="btn btn-secondary" onClick={onAddLink}>
            + Add Link
          </button>
        </div>

        <div className="preset-row">
          {PRESET_LINKS.map((label) => (
            <button
              key={label}
              type="button"
              className="preset-pill"
              onClick={() => onAddLink(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="link-list-editor">
          {Array.isArray(profile.links) && profile.links.length ? (
            profile.links.map((link, index) => (
              <div className="link-editor" key={link.id || `${index}-link`}>
                <div className="drag-column" aria-label={`Drag link ${index + 1}`} title="Drag to reorder">
                  <span>⋮⋮</span>
                </div>

                <div className="link-body">
                  <div className="form-grid two-up compact">
                    <label className="field small">
                      <span className="field-label">Title</span>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(event) => onLinkChange(link.id, 'title', event.target.value)}
                        placeholder="Instagram"
                      />
                    </label>

                    <label className="field small">
                      <span className="field-label">Icon</span>
                      <input
                        type="text"
                        value={link.icon || ''}
                        onChange={(event) => onLinkChange(link.id, 'icon', event.target.value)}
                        placeholder="IG"
                      />
                    </label>
                  </div>

                  <label className="field small">
                    <span className="field-label">URL</span>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(event) => onLinkChange(link.id, 'url', event.target.value)}
                      placeholder="https://instagram.com/username"
                    />
                  </label>
                </div>

                <div className="link-side-actions">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={link.enabled !== false}
                      onChange={(event) => onLinkChange(link.id, 'enabled', event.target.checked)}
                    />
                    <span className="switch-slider" />
                  </label>

                  <button
                    type="button"
                    className="link-delete"
                    onClick={() => onLinkChange(link.id, 'delete', true)}
                    aria-label={`Delete ${link.title || 'link'}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state compact">
              <p>No links added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
