export default function MonthlyCalendar({ schedules }) {
  const today = new Date();

  const month = today.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  const totalDays = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).getDay();

  const adjustedFirstDay =
    firstDay === 0 ? 6 : firstDay - 1;

  const calendarDays = [];

  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const hasSchedule = (day) => {
    if (!day) return false;

    return schedules.some((item) => {
      const itemDate = new Date(item.date);

      return (
        itemDate.getDate() === day &&
        itemDate.getMonth() ===
          today.getMonth() &&
        itemDate.getFullYear() ===
          today.getFullYear()
      );
    });
  };

  return (
    <section className="section">
      <div className="sectionHead">
        <h3>Kalender Bulanan</h3>
        <p>{month}</p>
      </div>

      <div className="monthlyCalendar">
        {days.map((day) => (
          <div key={day} className="dayName">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendarDay
              ${day === today.getDate() ? "today" : ""}
              ${hasSchedule(day) ? "hasEvent" : ""}
            `}
          >
            <span>{day}</span>

            {hasSchedule(day) && (
              <div className="eventDot"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}