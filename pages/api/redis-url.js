const URL = process.env.REDIS_URL;

export default async function handler(req, res) {
  return res.status(200).json({ URL })
}
