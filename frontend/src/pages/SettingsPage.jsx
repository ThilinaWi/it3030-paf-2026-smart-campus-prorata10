import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineAdjustments,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineChatAlt2,
  HiOutlineUserAdd,
  HiOutlineDesktopComputer,
} from 'react-icons/hi';
import notificationService from '../services/notificationService';
import { useAuth } from '../hooks/useAuth';

const defaultPreferences = {
  statusUpdates: true,
  technicianUpdates: true,
  assignments: true,
  system: true,
};

const preferenceItems = [
  {
    key: 'statusUpdates',
    title: 'Incident Status Updates',
    description: 'Get notified when incidents move through OPEN, IN_PROGRESS, RESOLVED, and CLOSED.',
    icon: HiOutlineClock,
    tone: 'status',
  },
  {
    key: 'technicianUpdates',
    title: 'Technician Updates',
    description: 'Receive comments and progress notes from assigned technicians.',
    icon: HiOutlineChatAlt2,
    tone: 'technician',
  },
  {
    key: 'assignments',
    title: 'Assignment Notifications',
    description: 'Get alerts when incidents are assigned to a technician.',
    icon: HiOutlineUserAdd,
    tone: 'assignment',
  },
  {
    key: 'system',
    title: 'System Notifications',
    description: 'Receive general updates about platform activity and important announcements.',
    icon: HiOutlineDesktopComputer,
    tone: 'system',
  },
];

const sections = [
  {
    key: 'profile',
    title: 'Profile',
    description: 'Manage your personal details and account preferences.',
    icon: HiOutlineUserCircle,
    path: '/settings/profile',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'Control how and when Smart Campus alerts you.',
    icon: HiOutlineBell,
    path: '/settings/notifications',
  },
  {
    key: 'security',
    title: 'Security',
    description: 'Review sign-in and account security options.',
    icon: HiOutlineShieldCheck,
    path: '/settings/security',
  },
];

const getActiveSection = (pathname) => {
  if (pathname.endsWith('/profile')) return 'profile';
  if (pathname.endsWith('/security')) return 'security';
  return 'notifications';
};

const normalizePreferences = (source) => ({
  statusUpdates: source?.statusUpdates ?? true,
  technicianUpdates: source?.technicianUpdates ?? true,
  assignments: source?.assignments ?? true,
  system: source?.system ?? true,
});

export default function SettingsPage() {
  const { user, updateProfile, uploadProfilePicture } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection = getActiveSection(location.pathname);

  const [preferences, setPreferences] = useState(defaultPreferences);
  const [lastSyncedPreferences, setLastSyncedPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(activeSection === 'notifications');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profileForm, setProfileForm] = useState({ name: '', profilePicture: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [pictureUploading, setPictureUploading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const arePreferencesEqual = (a, b) => (
    a.statusUpdates === b.statusUpdates
    && a.technicianUpdates === b.technicianUpdates
    && a.assignments === b.assignments
    && a.system === b.system
  );

  useEffect(() => {
    if (activeSection !== 'notifications') {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadPreferences = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const response = await notificationService.getPreferences();
        if (cancelled) return;
        const normalized = normalizePreferences(response);
        setPreferences(normalized);
        setLastSyncedPreferences(normalized);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(error?.response?.data?.message || 'Failed to load notification preferences.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, [activeSection]);

  useEffect(() => {
    setProfileForm({
      name: user?.name ?? '',
      profilePicture: user?.profilePicture ?? '',
    });
  }, [user]);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setAllPreferences = (enabled) => {
    setPreferences({
      statusUpdates: enabled,
      technicianUpdates: enabled,
      assignments: enabled,
      system: enabled,
    });
  };

  const handleProfileInputChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setPictureUploading(true);
      setProfileError('');
      setProfileSuccess('');

      const updatedUser = await uploadProfilePicture(file);
      setProfileForm((prev) => ({
        ...prev,
        profilePicture: updatedUser?.profilePicture ?? '',
      }));
      setProfileSuccess('Profile picture uploaded successfully.');
    } catch (error) {
      setProfileError(error?.response?.data?.message || 'Failed to upload profile picture.');
    } finally {
      setPictureUploading(false);
      event.target.value = '';
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    const payload = {
      name: profileForm.name.trim(),
      profilePicture: profileForm.profilePicture.trim() || null,
    };

    try {
      setProfileSaving(true);
      setProfileError('');
      setProfileSuccess('');

      const updatedUser = await updateProfile(payload);
      setProfileForm({
        name: updatedUser?.name ?? '',
        profilePicture: updatedUser?.profilePicture ?? '',
      });
      setProfileSuccess('Profile updated successfully.');
    } catch (error) {
      setProfileError(error?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  useEffect(() => {
    if (activeSection !== 'notifications' || loading) return;
    if (arePreferencesEqual(preferences, lastSyncedPreferences)) return;

    const preferencesToSave = { ...preferences };

    const timer = setTimeout(async () => {
      try {
        setSaving(true);
        setErrorMessage('');

        const response = await notificationService.updatePreferences(preferencesToSave);
        const normalized = normalizePreferences(response);

        setPreferences(normalized);
        setLastSyncedPreferences(normalized);
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'Failed to save notification preferences.');
      } finally {
        setSaving(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [activeSection, loading, preferences, lastSyncedPreferences]);

  return (
    <div className="settings-page">
      <div className="settings-page-inner">
        <div className="settings-hero-card">
          <div className="settings-hero-row">
            <div className="settings-hero-icon">
              <HiOutlineAdjustments size={20} />
            </div>
            <div>
              <h1 className="settings-hero-title">Settings</h1>
              <p className="settings-hero-subtitle">Manage your account, notification, and security preferences.</p>
            </div>
          </div>
        </div>

        <div className="settings-layout">
          <aside className="settings-sidebar-card">
            <nav className="settings-nav">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;
                return (
                  <Link
                    key={section.key}
                    to={section.path}
                    className={`settings-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} className="settings-nav-icon" />
                    <div>
                      <p className="settings-nav-title">{section.title}</p>
                      <p className="settings-nav-desc">{section.description}</p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="settings-content">
            {activeSection === 'notifications' && (
              <>
                <div className="settings-section-card">
                  <div className="settings-section-head">
                    <div>
                      <h2 className="settings-section-title">Notification Preferences</h2>
                      <p className="settings-section-subtitle">Manage how you receive notifications</p>
                      {saving && <p className="settings-autosave-note">Saving changes...</p>}
                    </div>
                    <div className="settings-head-actions">
                      <button
                        type="button"
                        onClick={() => setAllPreferences(true)}
                        className="settings-action-btn"
                      >
                        Enable All
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllPreferences(false)}
                        className="settings-action-btn"
                      >
                        Disable All
                      </button>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="settings-alert settings-alert-error">
                    {errorMessage}
                  </div>
                )}

                {loading ? (
                  <div className="settings-loading-card">
                    Loading notification preferences...
                  </div>
                ) : (
                  <div className="settings-pref-list">
                    {preferenceItems.map((item) => {
                      const Icon = item.icon;
                      const checked = Boolean(preferences[item.key]);

                      return (
                        <div
                          key={item.key}
                          className="settings-pref-card"
                        >
                          <div className="settings-pref-left">
                            <div className={`settings-pref-icon ${item.tone}`}>
                              <Icon size={18} />
                            </div>
                            <div className="settings-pref-copy">
                              <h3 className="settings-pref-title">{item.title}</h3>
                              <p className="settings-pref-desc">{item.description}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggle(item.key)}
                            className={`settings-toggle ${checked ? 'on' : ''}`}
                            aria-pressed={checked}
                            aria-label={`Toggle ${item.title}`}
                          >
                            <span className="settings-toggle-thumb" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

              </>
            )}

            {activeSection === 'profile' && (
              <div className="settings-section-card">
                <div className="settings-section-head">
                  <div>
                    <h2 className="settings-section-title">Profile Settings</h2>
                    <p className="settings-section-subtitle">Edit your name and choose your profile picture.</p>
                  </div>
                </div>

                <form className="settings-profile-form" onSubmit={handleProfileSave}>
                  {profileError && (
                    <div className="settings-alert settings-alert-error">{profileError}</div>
                  )}
                  {profileSuccess && (
                    <div className="settings-alert settings-alert-success">{profileSuccess}</div>
                  )}

                  <div className="settings-profile-grid">
                    <label className="settings-profile-field" htmlFor="profile-name">
                      <span className="settings-profile-label">Display Name</span>
                      <input
                        id="profile-name"
                        name="name"
                        type="text"
                        value={profileForm.name}
                        onChange={handleProfileInputChange}
                        className="settings-profile-input"
                        maxLength={80}
                        required
                      />
                    </label>

                    <label className="settings-profile-field" htmlFor="profile-email">
                      <span className="settings-profile-label">Email</span>
                      <input
                        id="profile-email"
                        type="email"
                        value={user?.email ?? ''}
                        className="settings-profile-input"
                        disabled
                      />
                    </label>

                    <div className="settings-profile-field settings-profile-field-full">
                      <span className="settings-profile-label">Choose Picture</span>
                      <div className="settings-picture-picker-row">
                        <div className="settings-picture-preview-wrap">
                          {profileForm.profilePicture ? (
                            <img
                              src={profileForm.profilePicture}
                              alt="Profile preview"
                              className="settings-picture-preview"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="settings-picture-preview-fallback">No photo</span>
                          )}
                        </div>

                        <label className="settings-action-btn settings-upload-btn" htmlFor="profile-picture-file">
                          {pictureUploading ? 'Uploading...' : 'Choose Picture'}
                        </label>
                        <input
                          id="profile-picture-file"
                          type="file"
                          accept="image/*"
                          className="settings-hidden-file-input"
                          onChange={handleProfilePictureFileChange}
                          disabled={pictureUploading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="settings-profile-actions">
                    <button type="submit" className="settings-action-btn" disabled={profileSaving}>
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="settings-placeholder-card">
                <div className="settings-placeholder-inner">
                  <div className="settings-placeholder-icon">
                    <HiOutlineSparkles size={20} />
                  </div>
                  <h2 className="settings-placeholder-title">Security Settings</h2>
                  <p className="settings-placeholder-desc">
                    This section is coming next. You can continue configuring notifications now.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/settings/notifications')}
                    className="settings-action-btn"
                  >
                    Go To Notifications
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
