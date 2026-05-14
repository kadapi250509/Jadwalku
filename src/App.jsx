import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import LoginRegister from "./LoginRegister";
import Dashboard from "./Dashboard";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [session, setSession] = useState(null);

  const [theme, setTheme] = useState("#6d5dfc");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", theme);

    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme, darkMode]);

  return (
    <>
      <Toaster position="top-right" />

      {session ? (
        <Dashboard
          user={session.user}
          onLogout={() => supabase.auth.signOut()}
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