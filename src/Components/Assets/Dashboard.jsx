const Dashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard! Here you can view your recent activity and statistics.</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Stats</h2>
        <ul>
          <li>Users: 120</li>
          <li>Active Sessions: 15</li>
          <li>Revenue: $2,340</li>
        </ul>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>Recent Activity</h2>
        <ol>
          <li>User JohnDoe logged in</li>
          <li>Order #1234 was placed</li>
          <li>Report generated</li>
        </ol>
      </div>
    </div>
  );
};

export default Dashboard;