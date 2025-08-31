import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <div style={{marginLeft:"210px", padding:"16px"}}>
        <h2>Hi, Harshal 👋</h2>
        <div className="card">Find a Skill</div>
        <div className="card">Offer a Skill</div>
      </div>
    </div>
  );
}
