const moment = (timestamp) => {
  const date = new Date(timestamp);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    const time = date.toLocaleTimeString("tr-TR", options);
    return time;
  }

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  if (date >= lastWeek && date <= yesterday)
    return date.toLocaleDateString("en-EN", { weekday: "long" });

  if (date < lastWeek) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("tr-TR", options);
  }
};

export default moment;
