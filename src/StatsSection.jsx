import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatsSection({
  schedules,
}) {
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const chartData = days.map((day, index) => {
    const total = schedules.filter((item) => {
      const itemDay = new Date(item.date).getDay();
      return itemDay === index;
    }).length;

    return {
      day: day.slice(0, 3),
      total,
    };
  });

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayCount = schedules.filter(
    (item) => item.date === today
  ).length;

  return (
    <section className="section">
      <div className="sectionHead">
        <h3>Statistik Produktivitas</h3>
        <p>
          Statistik berdasarkan jadwal asli
          kamu
        </p>
      </div>

      <div className="statsGrid">
        <div className="featureCard">
          <h2>{schedules.length}</h2>
          <p>Total Jadwal</p>
        </div>

        <div className="featureCard">
          <h2>{todayCount}</h2>
          <p>Jadwal Hari Ini</p>
        </div>
      </div>

      <div
        className="featureCard"
        style={{ height: 320 }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}