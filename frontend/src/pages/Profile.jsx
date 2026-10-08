import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/userSlice";

function Profile() {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token && !profile && status === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, profile, status]);

  return (
    <section className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View your account details.</p>
      </div>

      {!token && (
        <div className="analytics-card">
          <p>Please log in to view your profile.</p>
          <Link to="/login">Go to login</Link>
        </div>
      )}

      {token && status === "loading" && (
        <div className="analytics-card" role="status">Loading profile...</div>
      )}

      {token && status === "failed" && (
        <div className="analytics-card">
          <p className="error-message">{error || "Unable to load your profile."}</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => dispatch(fetchCurrentUser())}
          >
            Try again
          </button>
        </div>
      )}

      {profile && status === "succeeded" && (
        <div className="analytics-card">
          <h2>Account information</h2>
          <dl className="profile-details">
            <div>
              <dt>Name</dt>
              <dd>{profile.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profile.email}</dd>
            </div>
            {profile.id && (
              <div>
                <dt>Account ID</dt>
                <dd>{profile.id}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </section>
  );
}

export default Profile;
