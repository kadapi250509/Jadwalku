import toast from "react-hot-toast";
import { useState } from "react";
import { supabase } from "./supabase";

export default function CalendarSection({
  schedules,
  reloadSchedules,
}) {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTask("");
    setDate("");
    setTime("");
    setEditId(null);
    setError("");
  };

  const addOrUpdateSchedule = async () => {
    if (!task || !date || !time) {
      toast.error("Isi semua data terlebih dahulu!");
      return;
    }

    setSaving(true);
    setError("");

    const { data: userData } =
      await supabase.auth.getUser();

    const payload = {
      title: task,
      date,
      time,
      user_id: userData.user.id,
    };

    if (editId !== null) {
      const { error } = await supabase
        .from("schedules")
        .update(payload)
        .eq("id", editId);

      if (error) {
        setError(error.message);
        toast.error(error.message);
        setSaving(false);
        return;
      }

      toast.success(
        "Jadwal berhasil diperbarui!"
      );
    } else {
      const { error } = await supabase
        .from("schedules")
        .insert([payload]);

      if (error) {
        setError(error.message);
        toast.error(error.message);
        setSaving(false);
        return;
      }

      toast.success(
        "Jadwal berhasil ditambahkan!"
      );
    }

    await reloadSchedules();
    resetForm();
    setSaving(false);
  };

  const deleteSchedule = async (id) => {
    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("schedules")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setSaving(false);
      return;
    }

    toast.success("Jadwal berhasil dihapus!");

    await reloadSchedules();
    setSaving(false);
  };

  const startEdit = (item) => {
    setTask(item.title);
    setDate(item.date);
    setTime(item.time);
    setEditId(item.id);

    toast("Mode edit aktif");
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(
      `${dateString}T00:00:00`
    );

    return dateObj.toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };
const toggleComplete = async (item) => {
  const { error } = await supabase
    .from("schedules")
    .update({
      completed: !item.completed,
    })
    .eq("id", item.id);

  if (!error) {
    reloadSchedules();
  }
};
  return (
    <section className="section">
      <div className="sectionHead">
        <h3>Kalender Jadwal</h3>
        <p>
          Tambahkan, edit, atau hapus
          aktivitas harianmu
        </p>
      </div>

      <div className="calendarBox">
        <div className="calendarForm">
          <input
            type="text"
            placeholder="Nama jadwal"
            value={task}
            onChange={(e) =>
              setTask(e.target.value)
            }
          />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
          />

          <button
            onClick={addOrUpdateSchedule}
            disabled={saving}
          >
            {saving
              ? "Memproses..."
              : editId !== null
              ? "Simpan Perubahan"
              : "Tambah Jadwal"}
          </button>

          {editId !== null && (
            <button
              className="cancelBtn"
              onClick={resetForm}
              disabled={saving}
            >
              Batal
            </button>
          )}
        </div>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <div className="calendarList">
          {schedules.length === 0 ? (
            <p>
              Belum ada jadwal yang
              ditambahkan.
            </p>
          ) : (
            schedules.map((item) => (
              <div
                className="calendarItem"
                key={item.id}
              >
                <div>
                  <strong
  style={{
    textDecoration: item.completed
      ? "line-through"
      : "none",
    opacity: item.completed ? 0.6 : 1,
  }}
>
  {item.title}
</strong>

                  <p>
                    📅{" "}
                    {formatDate(item.date)}
                  </p>

                  <p>
                    ⏰ {item.time}
                  </p>
                </div>

               <div className="calendarActions">
  <button
    className="doneBtn"
    onClick={() => toggleComplete(item)}
  >
    {item.completed ? "Batal" : "Selesai"}
  </button>

  <button
    className="editBtn"
    onClick={() => startEdit(item)}
    disabled={saving}
  >
    Edit
  </button>

  <button
    className="deleteBtn"
    onClick={() => deleteSchedule(item.id)}
    disabled={saving}
  >
    Hapus
  </button>
</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}