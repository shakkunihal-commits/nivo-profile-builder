import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './Button';
import Modal from './Modal';
import Toast from './Toast';
import ProfileForm from './ProfileForm';
import PublicProfile from './PublicProfile';
import {
  createProfile,
  deleteProfile,
  duplicateProfile,
  ensureUniqueSlug,
  getInitialProfile,
  getProfile,
  getProfiles,
  normalizeUrl,
  updateProfile,
  createLinkTemplate,
  getProfileBySlug,
} from '../services/profileStorage';

export default function ProfileEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [toast, setToast] = useState({ message: '', visible: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profile, setProfile] = useState(() => {
    if (id) {
      const existing = getProfile(id);
      return existing ? { ...existing, links: existing.links ?? [] } : getInitialProfile();
    }
    return getInitialProfile();
  });

  const [profileError, setProfileError] = useState('');

  const currentProfile = useMemo(() => profile, [profile]);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value, updatedAt: new Date().toISOString() }));
  };

  const handleSlugChange = (value) => {
    const nextValue = value.trim();
    setProfile((prev) => ({
      ...prev,
      slug: nextValue,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddLink = (presetTitle = 'Custom Link') => {
    setProfile((prev) => ({
      ...prev,
      links: [...(prev.links || []), createLinkTemplate(presetTitle)],
    }));
  };

  const handleLinkChange = (linkId, field, value) => {
    if (field === 'delete') {
      setProfile((prev) => ({
        ...prev,
        links: (prev.links || []).filter((link) => link.id !== linkId),
      }));
      return;
    }

    setProfile((prev) => ({
      ...prev,
      links: (prev.links || []).map((link) =>
        link.id === linkId ? { ...link, [field]: value } : link
      ),
    }));
  };

  const handleDragStart = (index) => {
    setProfile((prev) => ({ ...prev, dragIndex: index }));
  };

  const handleDrop = (targetIndex) => {
    setProfile((prev) => {
      const links = [...(prev.links || [])];
      const from = prev.dragIndex ?? 0;
      const [moved] = links.splice(from, 1);
      links.splice(targetIndex, 0, moved);
      return { ...prev, links, dragIndex: null };
    });
  };

  const saveProfile = () => {
    const cleanName = (profile.name || '').trim();
    if (!cleanName) {
      setProfileError('Please add a customer name before saving.');
      return;
    }

    const cleanSlug = (profile.slug || cleanName).trim();
    const slug = ensureUniqueSlug(cleanSlug, profile.id || null);

    const safeLinks = (profile.links || []).map((link) => ({
      ...link,
      title: (link.title || 'Custom Link').trim() || 'Custom Link',
      url: normalizeUrl(link.url || ''),
      icon: (link.icon || '').trim(),
      enabled: link.enabled !== false,
    }));

    const normalized = {
      ...profile,
      id: profile.id || crypto.randomUUID(),
      name: cleanName,
      slug,
      bio: (profile.bio || '').trim(),
      location: (profile.location || '').trim(),
      status: (profile.status || '').trim(),
      avatar: (profile.avatar || '').trim(),
      links: safeLinks,
      updatedAt: new Date().toISOString(),
    };

    const saved = profile.id ? updateProfile(normalized) : createProfile(normalized);
    setProfile(saved);
    setProfileError('');
    setToast({ message: 'Profile saved successfully.', visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2200);
  };

  const handleCancel = () => {
    navigate('/admin/profiles');
  };

  const handleDelete = () => {
    if (profile.id) {
      deleteProfile(profile.id);
      navigate('/admin/profiles');
      return;
    }

    setShowDeleteModal(false);
  };

  const handleDuplicate = () => {
    if (!profile.id) return;
    const duplicated = duplicateProfile(profile.id);
    if (duplicated) {
      navigate(`/admin/profiles/${duplicated.id}`);
    }
  };

  return (
    <div className="page-shell admin-shell">
      <header className="topbar topbar-admin">
        <div className="brand-block whitespace-left">
          <span className="brand-wordmark">NIVO</span>
          <span className="mono">/ profile builder</span>
        </div>

        <div className="toolbar-actions">
          <Button variant="secondary" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          {profile.id && (
            <Button variant="secondary" type="button" onClick={handleDuplicate}>
              Duplicate
            </Button>
          )}
          {profile.id && (
            <Button variant="danger" type="button" onClick={() => setShowDeleteModal(true)}>
              Delete
            </Button>
          )}
          <Button type="button" onClick={saveProfile}>
            Save Profile
          </Button>
        </div>
      </header>

      {profileError && <div className="alert error">{profileError}</div>}

      <main className="editor-grid shell-width">
        <section className="panel editor-panel">
          <div className="panel-header stacked minor-gap">
            <div>
              <p className="eyebrow">Profile Builder</p>
              <h2>Customer profile</h2>
            </div>
            <p className="mono subtle">public URL: {profile.slug ? `/p/${profile.slug}` : '/p/your-slug'}</p>
          </div>

          <ProfileForm
            profile={currentProfile}
            onProfileChange={handleProfileChange}
            onSlugChange={handleSlugChange}
            onAddLink={handleAddLink}
            onLinkChange={handleLinkChange}
          />
        </section>

        <aside className="panel preview-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live Preview</p>
              <h3>Public profile</h3>
            </div>
          </div>

          <div className="preview-card">
            <PublicProfileView profile={currentProfile} />
          </div>
        </aside>
      </main>

      <Modal
        open={showDeleteModal}
        title="Delete profile"
        message="This action removes the profile from local storage. This cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        confirmText="Delete profile"
      />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}

function PublicProfileView({ profile }) {
  const safeLinks = (profile.links || []).filter((link) => link.enabled !== false && link.url);

  return (
    <div className="public-preview-shell">
      <header className="public-header small-header">
        <div className="brand-row">
          <span className="brand-wordmark">NIVO</span>
          <span className="mono micro">SIGNAL / 001</span>
        </div>
        {profile.status && <span className="status-label">{profile.status}</span>}
      </header>

      <section className="public-hero preview-hero">
        <div className="public-media-wrap">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name || 'Profile avatar'} className="public-avatar" />
          ) : (
            <div className="public-avatar placeholder">{profile.name ? profile.name.charAt(0).toUpperCase() : 'N'}</div>
          )}
        </div>

        <div className="public-meta-block">
          <p className="mono meta-top">/{profile.slug || 'your-slug'}</p>
          <h1>{profile.name || 'Customer Name'}</h1>
          {profile.location && <p className="mono location">{profile.location}</p>}
          <p className="bio">{profile.bio || 'Tell customers who you are in a few words.'}</p>
        </div>
      </section>

      <div className="public-links preview-links">
        {safeLinks.length ? (
          safeLinks.map((link) => (
            <div className="public-link preview-link" key={link.id}>
              <span>{link.icon || link.title.slice(0, 2).toUpperCase()}</span>
              <span>{link.title || 'Custom Link'}</span>
            </div>
          ))
        ) : (
          <div className="empty-state compact">
            <p>No active links yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
