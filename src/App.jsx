import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import LoginRegister from "./LoginRegister";
import Dashboard from "./Dashboard";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("jadwalku-theme") || "purple";
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("jadwalku-dark") === "true";
  });

  useEffect(() => {
    document.body.className = "";

    document.body.classList.add(theme);

    if (darkMode) {
      document.body.classList.add("dark");
    }

    localStorage.setItem("jadwalku-theme", theme);
    localStorage.setItem("jadwalku-dark", String(darkMode));
  }, [theme, darkMode]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!ready) {
    return (
      <div className="authWrap">
        <div className="authCard" style={{ placeItems: "center" }}>
          Memuat...
        </div>
      </div>
    );
  }

 return (
  <>
    <Toaster position="top-right" />

    {user ? (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    ) : (
      <LoginRegister />
    )}
  </>
);
}