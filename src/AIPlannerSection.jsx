import { useState } from "react";

export default function AIPlannerSection({ onGenerate }) {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    onGenerate(prompt);
    setPrompt("");
  };

  return (
    <section className="section" id="ai">
      <div className="sectionHead">
        <h3>AI Planner</h3>
        <p>Tulis kebutuhanmu, lalu sistem bantu buat jadwal otomatis</p>
      </div>

      <div className="aiPlannerBox">
        <textarea
          className="aiTextarea"
          placeholder="Contoh: buat jadwal belajar matematika besok jam 19:00 selama 2 jam"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button className="primaryBtn" type="button" onClick={handleGenerate}>
          Buat Jadwal Otomatis
        </button>
      </div>
    </section>
  );
}