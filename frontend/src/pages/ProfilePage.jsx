function ProfilePage({ user }) {
  return (
    <div>
      <h1>Profile</h1>

      <div className="card profile-card">
        <div className="avatar-large">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h3>{user?.username}</h3>
          <p>{user?.email}</p>
          <p>{user?.fullName || "No full name provided"}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
