import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Navbar({
  user,
  onLogout,
  theme,
  setTheme,
  darkMode,
  setDarkMode,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || "https://i.pravatar.cc/100"
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setAvatarUrl(user?.user_metadata?.avatar_url || "https://i.pravatar.cc/100");
  }, [user]);

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("id-ID");

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const newAvatarUrl = data.publicUrl;

    setAvatarUrl(newAvatarUrl);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: newAvatarUrl },
    });

    if (updateError) {
      console.error(updateError);
    }

    setUploading(false);
  };

  return (
    <div className="navbar">
      <div>
        <h2>Dashboard</h2>
        <p>Selamat datang di Jadwalku 🚀</p>
        <div className="dateText">{formattedDate}</div>
        <div className="timeText">{formattedTime}</div>
      </div>

      <div className="navRight">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="themeSelect"
        >
          <option value="purple">Ungu</option>
          <option value="blue">Biru</option>
          <option value="green">Hijau</option>
          <option value="pink">Pink</option>
        </select>

        <button className="darkBtn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <label className="profileUpload">
          <img src={avatarUrl} alt="profile" />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            hidden
          />
        </label>

        <div>
          <strong>{user?.user_metadata?.username || "User"}</strong>
          <span>{user?.email || "user@email.com"}</span>
          {uploading && <div className="uploadingText">Mengupload...</div>}
        </div>

        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
