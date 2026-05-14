import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import LoginRegister from "./LoginRegister";
import Dashboard from "./Dashboard";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [session, setSession] = useState(null);

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

  return (
    <>
      <Toaster position="top-right" />

      {session ? (
        <Dashboard
          user={session.user}
          onLogout={() => supabase.auth.signOut()}
        />
      ) : (
        <LoginRegister />
      )}
    </>
  );
}