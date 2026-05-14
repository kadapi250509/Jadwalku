import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ReminderChecker({
  schedules,
}) {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const currentDate =
        now.toISOString().split("T")[0];

      const currentTime =
        now.toTimeString().slice(0, 5);

      schedules.forEach((item) => {
        if (
          item.date === currentDate &&
          item.time === currentTime
        ) {
          toast.success(
            `⏰ Reminder: ${item.title}`
          );
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [schedules]);

  return null;
}