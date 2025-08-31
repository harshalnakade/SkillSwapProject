import Sidebar from "../components/Sidebar";
import SkillCard from "../components/SkillCard";

export default function SkillListings() {
  const skills = [
    { name: "Web Development", user: "Harshal", level: "Intermediate" },
    { name: "Guitar", user: "Santoshi", level: "Beginner" }
  ];

  return (
    <div>
      <Sidebar />
      <div style={{marginLeft:"210px", padding:"16px"}}>
        <h2>Available Skills</h2>
        {skills.map((skill, idx) => <SkillCard key={idx} skill={skill} />)}
      </div>
    </div>
  );
}
