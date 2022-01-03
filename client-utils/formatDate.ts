import format from "date-fns/format";

export default (timestamp: number) => {
  return format(Number(timestamp), "MMMM dd yyyy");
};
