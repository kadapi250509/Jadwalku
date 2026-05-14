import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Navbar from "./Navbar";
import CalendarSection from "./CalendarSection";
import MonthlyCalendar from "./MonthlyCalendar";
import AIPlannerSection from "./AIPlannerSection";
import StatsSection from "./StatsSection";

export default function Dashboard({
  user,
  onLogout,
  theme,
  setTheme,
  darkMode,
  setDarkMode,
}) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSchedules = async () => {
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error(userError);
      setSchedules([]);
      setLoading(false);
      return;
    }

    const currentUser = userData.user;

    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) {
      console.error(error);
      setSchedules([]);
    } else {
      setSchedules(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const generateFromPrompt = async (prompt) => {
    const lower = prompt.toLowerCase();

    let title = "Jadwal Baru";
    if (lower.includes("belajar")) title = "Belajar";
    else if (lower.includes("tugas")) title = "Kerjakan Tugas";
    else if (lower.includes("kerja")) title = "Pekerjaan";
    else if (lower.includes("olahraga")) title = "Olahraga";

    const timeMatch = prompt.match(/(\d{1,2}[:.]\d{2})/);
    const time = timeMatch ? timeMatch[1].replace(".", ":") : "19:00";

    const dateObj = new Date();
    if (lower.includes("besok")) {
      dateObj.setDate(dateObj.getDate() + 1);
    }

    const date = dateObj.toISOString().split("T")[0];

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error(userError);
      return;
    }

    const currentUser = userData.user;

    const { error } = await supabase.from("schedules").insert([
      {
        title,
        date,
        time,
        user_id: currentUser.id,
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    await loadSchedules();
  };

  const todayKey = new Date().toISOString().split("T")[0];
  const todayCount = schedules.filter((item) => item.date === todayKey).length;

  const features = [
    "Login & Register",
    "AI Scheduler",
    "Profil Pengguna",
    "Tema Warna",
    "Bahasa ID / EN",
    "Kalender Jadwal",
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logoBox">
          <div className="logoIcon">📅</div>
          <div>
            <h1>Jadwalku</h1>
            <p>Atur waktumu dengan lebih rapi</p>
          </div>
        </div>

        <nav className="menu">
          <a href="#dashboard">Dashboard</a>
          <a href="#jadwal">Jadwal</a>
          <a href="#ai">AI Planner</a>
          <a href="#profil">Profil</a>
          <a href="#setting">Pengaturan</a>
        </nav>
      </aside>

      <main className="main">
        <Navbar
          user={user}
          onLogout={onLogout}
          theme={theme}
          setTheme={setTheme}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <section className="hero" id="dashboard">
          <div className="heroText">
            <span className="badge">Smart Scheduler</span>
            <h2>Kelola jadwal belajar, tugas, dan kerja dalam satu aplikasi.</h2>
            <p>
              Jadwalku membantu kamu menyusun aktivitas harian secara manual
              maupun otomatis dengan AI.
            </p>

            <div className="heroActions">
              <button className="primaryBtn" type="button">
                Mulai Sekarang
              </button>
              <button className="secondaryBtn" type="button">
                Lihat Fitur
              </button>
            </div>
          </div>

          <div className="heroCard">
            <h3>Hari Ini</h3>
            <div className="heroStat">
              <div>
                <strong>{schedules.length}</strong>
                <span>Jadwal Aktif</span>
              </div>
              <div>
                <strong>{todayCount}</strong>
                <span>Hari Ini</span>
              </div>
            </div>
          </div>
        </section>

        <AIPlannerSection onGenerate={generateFromPrompt} />

        <section className="section" id="jadwal">
          <div className="sectionHead">
            <h3>Jadwal Tersimpan</h3>
            <p>Data langsung diambil dari Supabase</p>
          </div>

          {loading ? (
            <p>Memuat jadwal...</p>
          ) : (
            <CalendarSection
              schedules={schedules}
              reloadSchedules={loadSchedules}
            />
          )}
        </section>

        <MonthlyCalendar schedules={schedules} />
        <StatsSection schedules={schedules} />

        <section className="section" id="profil">
          <div className="sectionHead">
            <h3>Profil Pengguna</h3>
            <p>Data akun yang sedang login</p>
          </div>

          <div className="settingsBox">
            <div>
              <strong>Username</strong>
              <p>{user?.user_metadata?.username || "-"}</p>
            </div>
            <div>
              <strong>Email</strong>
              <p>{user?.email || "-"}</p>
            </div>
          </div>
        </section>

        <section className="section" id="setting">
          <div className="sectionHead">
            <h3>Fitur Aplikasi</h3>
            <p>Semua fitur utama dalam satu tempat</p>
          </div>

          <div className="featureGrid">
            {features.map((feature, index) => (
              <div className="featureCard" key={index}>
                {feature}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
