import Cookies from "cookies";

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("scrapbook_access_token");
  if (token) return res.send("TRUE");
  else return res.send("FALSE");
}
