export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ status: "ok", pages: [] });
}
