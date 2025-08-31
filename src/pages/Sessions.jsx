import Sidebar from "../components/Sidebar";

export default function Sessions() {
  const sessions = [
    { skill: "Web Dev", date: "2025-09-01", status: "Pending" },
    { skill: "Guitar", date: "2025-08-28", status: "Completed" }
  ];

  return (
    <div>
      <Sidebar />
      <div style={{marginLeft:"210px", padding:"16px"}}>
        <h2>Sessions</h2>
        {sessions.map((s, idx) => (
          <div key={idx} className="card">
            <p>{s.skill}</p>
            <p>{s.date}</p>
            <p>Status: {s.status}</p>
          </div>
        ))}
        <button>Request New Session</button>
      </div>
    </div>
  );
}
