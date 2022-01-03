import randomstring from "randomstring";
import redis from "./redis";

const ID_KEY = "id";

export default async function uniqueID() {
  const str = randomstring.generate({
    length: 15,
    charset: "alphabetic",
  });
  const id = await redis.incr(ID_KEY);
  return `${str}${id}`
}
