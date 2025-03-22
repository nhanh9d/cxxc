export const formattedDate = (date: Date) => {
  const dateString = date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}