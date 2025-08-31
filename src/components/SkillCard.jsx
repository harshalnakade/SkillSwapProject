export default function SkillCard({ skill }) {
  return (
    <div className="card">
      <h4>{skill.name}</h4>
      <p>Offered by: {skill.user}</p>
      <p>Level: {skill.level}</p>
      <button>Request Session</button>
    </div>
  );
}
