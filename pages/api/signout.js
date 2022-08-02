import Cookies from "cookies";

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  cookies.set("scrapbook_access_token", "", {
    overwrite: true,
    expires: Date.now(),
    httpOnly: true,
  });
  res.redirect("/");
}
