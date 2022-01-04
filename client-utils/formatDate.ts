import format from "date-fns/format";

export default (timestamp: number) => {
  return format(Number(timestamp), "MMMM dd yyyy");
};

export const formatTime = (timestamp: number) => {
  // 12:10:20 AM GMT-08:00
  return format(Number(timestamp), "pppp");
}