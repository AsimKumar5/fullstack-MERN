import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Moon, Sun, UserRound, Waves } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/userSlice";

const defaultPreferences = {
  theme: "light",
  reducedMotion: false,
};

const readPreferences = () => {
  try {
    const savedPreferences = localStorage.getItem("appPreferences");
    if (!savedPreferences) return defaultPreferences;
    const parsed = JSON.parse(savedPreferences);
    return {
      theme: parsed.theme === "dark" ? "dark" : "light",
      reducedMotion: parsed.reducedMotion === true,
    };
  } catch {
    return defaultPreferences;
  }
};

function Settings() {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);
  const [preferences, setPreferences] = useState(readPreferences);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (token && !profile && status === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, profile, status]);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.motion = preferences.reducedMotion
      ? "reduced"
      : "full";
  }, [preferences]);

  const updatePreference = (updates) => {
    setPreferences((current) => ({ ...current, ...updates }));
    setSaveMessage("");
    setSaveError("");
  };

  const handleSave = () => {
    try {
      localStorage.setItem("appPreferences", JSON.stringify(preferences));
      setSaveMessage("Your preferences have been saved on this device.");
      setSaveError("");
    } catch (saveFailure) {
      console.error("Unable to save app preferences:", saveFailure);
      setSaveError("Could not save preferences in this browser.");
      setSaveMessage("");
    }
  };

  const handleReset = () => {
    updatePreference(defaultPreferences);
    try {
      localStorage.removeItem("appPreferences");
      setSaveMessage("Default preferences restored.");
      setSaveError("");
    } catch (saveFailure) {
      console.error("Unable to reset app preferences:", saveFailure);
      setSaveError("Could not reset preferences in this browser.");
      setSaveMessage("");
    }
  };

  return (
    <section className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Personalize your workspace and account experience.</p>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-main">
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-icon"><Sun size={19} /></div>
              <div>
                <h2>Appearance</h2>
                <p>Choose how the dashboard looks on this device.</p>
              </div>
            </div>

            <div className="theme-options" role="radiogroup" aria-label="Color theme">
              <button
                className={`theme-option ${preferences.theme === "light" ? "selected" : ""}`}
                type="button"
                role="radio"
                aria-checked={preferences.theme === "light"}
                onClick={() => updatePreference({ theme: "light" })}
              >
                <span className="theme-preview theme-preview-light"><Sun size={20} /></span>
                <span className="theme-option-copy">
                  <strong>Light</strong>
                  <small>Bright and clear</small>
                </span>
                {preferences.theme === "light" && <Check size={17} />}
              </button>
              <button
                className={`theme-option ${preferences.theme === "dark" ? "selected" : ""}`}
                type="button"
                role="radio"
                aria-checked={preferences.theme === "dark"}
                onClick={() => updatePreference({ theme: "dark" })}
              >
                <span className="theme-preview theme-preview-dark"><Moon size={20} /></span>
                <span className="theme-option-copy">
                  <strong>Dark</strong>
                  <small>Easy on the eyes</small>
                </span>
                {preferences.theme === "dark" && <Check size={17} />}
              </button>
            </div>

            <div className="settings-toggle-row">
              <span className="settings-toggle-icon"><Waves size={18} /></span>
              <span className="settings-toggle-copy">
                <strong>Reduce motion</strong>
                <small>Limit decorative animations and transitions.</small>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.reducedMotion}
                aria-label="Reduce motion"
                className={`settings-switch ${preferences.reducedMotion ? "on" : ""}`}
                onClick={() => updatePreference({ reducedMotion: !preferences.reducedMotion })}
              >
                <span />
              </button>
            </div>

            {saveMessage && <p className="settings-feedback success">{saveMessage}</p>}
            {saveError && <p className="settings-feedback error">{saveError}</p>}

            <div className="settings-actions">
              <button className="secondary-button" type="button" onClick={handleReset}>
                Restore defaults
              </button>
              <button className="primary-button" type="button" onClick={handleSave}>
                Save preferences
              </button>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-icon account"><UserRound size={19} /></div>
              <div>
                <h2>Account</h2>
                <p>Your signed-in account information.</p>
              </div>
            </div>

            {status === "loading" && <p className="settings-hint">Loading account details...</p>}
            {status === "failed" && (
              <p className="settings-feedback error">
                {error || "Unable to load account details."}
              </p>
            )}
            {!token && (
              <p className="settings-hint">
                Sign in to view your account details. <Link to="/login">Go to login</Link>
              </p>
            )}
            {profile && (
              <dl className="settings-account-details">
                <div><dt>Full name</dt><dd>{profile.name}</dd></div>
                <div><dt>Email address</dt><dd>{profile.email}</dd></div>
              </dl>
            )}
            <Link className="settings-text-link" to={profile ? "/profile" : "/forgot-password"}>
              {profile ? "View full profile" : "Reset password"}
            </Link>
          </section>
        </div>

        <aside className="settings-aside">
          <div className="settings-note">
            <span className="settings-note-badge">Your workspace</span>
            <h2>Make it feel like yours.</h2>
            <p>Appearance choices are saved in this browser and apply across the dashboard.</p>
            <div className="settings-note-orbit"><Sun size={25} /></div>
          </div>
          <div className="settings-tip">
            <strong>Privacy note</strong>
            <p>Theme and motion preferences stay on this device. Account details come from your signed-in profile.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Settings;
