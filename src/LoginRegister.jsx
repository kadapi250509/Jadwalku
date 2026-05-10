import { useState } from "react";
import { supabase } from "./supabase";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Login berhasil.");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        if (data.session) {
          setMessage("Akun berhasil dibuat.");
        } else {
          setMessage("Akun dibuat. Cek email untuk verifikasi.");
        }
        setIsLogin(true);
        setPassword("");
      }
    }

    setLoading(false);
  };

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authSide">
          <div className="authLogo">📅</div>
          <h1>Jadwalku</h1>
          <p>
            Aplikasi untuk mengatur jadwal belajar, tugas, dan pekerjaan dengan
            lebih rapi dan modern.
          </p>

          <div className="authInfoBox">
            <div>
              <strong>Smart AI</strong>
              <span>Bantu membuat jadwal otomatis</span>
            </div>
            <div>
              <strong>Custom Theme</strong>
              <span>Ubah warna tampilan aplikasi</span>
            </div>
            <div>
              <strong>Multi Language</strong>
              <span>Indonesia dan English</span>
            </div>
          </div>
        </div>

        <div className="authFormBox">
          <div className="authTabs">
            <button
              type="button"
              className={isLogin ? "tab active" : "tab"}
              onClick={() => {
                setIsLogin(true);
                setMessage("");
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              className={!isLogin ? "tab active" : "tab"}
              onClick={() => {
                setIsLogin(false);
                setMessage("");
              }}
            >
              Daftar
            </button>
          </div>

          <form className="authForm" onSubmit={handleSubmit}>
            <h2>{isLogin ? "Login ke akunmu" : "Buat akun baru"}</h2>

            {!isLogin && (
              <>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Nama pengguna"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </>
            )}

            <label>Email</label>
            <input
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder={isLogin ? "Masukkan password" : "Buat password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="mainBtn" disabled={loading}>
              {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
            </button>

            {message && <p className="smallText">{message}</p>}

            {!isLogin ? (
              <p className="smallText">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  className="linkBtn"
                  onClick={() => setIsLogin(true)}
                >
                  Masuk saja
                </button>
              </p>
            ) : (
              <p className="smallText">
                Belum punya akun?{" "}
                <button
                  type="button"
                  className="linkBtn"
                  onClick={() => setIsLogin(false)}
                >
                  Daftar dulu
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
