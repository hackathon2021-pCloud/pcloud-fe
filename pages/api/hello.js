// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import redis from "../../lib/redis";

export default async function handler(req, res) {
  const name = await redis.get('name')
  res.status(200).json({ name })
}
