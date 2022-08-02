import Cookies from "cookies";
import crypto from "node:crypto";
import fetch from "node-fetch";

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  if (cookies.get("assemble_use_localhost") === "true")
    return res.redirect(
      "http://localhost:3000/api/auth?auth_code=" +
        encodeURIComponent(req.query.auth_code)
    );
  const { auth_code } = req.query;
  const codeVerifier = cookies.get("assemble_code_verifier");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  const url = `https://api.id.assemble.hackclub.com/oauth/token?auth_code=${encodeURIComponent(
    auth_code
  )}&code_verifier=${encodeURIComponent(
    codeVerifier
  )}&code_challenge=${encodeURIComponent(codeChallenge)}&method=S256`;
  const response = await fetch(url).then((response) => response.json());
  const sevenDaysInMs = 60 * 60 * 1000 * 24 * 7;
  cookies.set("scrapbook_access_token", response.access_token, {
    overwrite: true,
    expires: new Date(Date.now() + sevenDaysInMs),
    httpOnly: true,
  });

  // sam do stuff with response.user_email and response.user_id here
  // provide the user ID here since you know it's true (not spoofed)

  cookies.set("scrapbook_user_data_json", JSON.stringify({
    email: response.user_email,
    id: response.user_id,
  }), {
    overwrite: true,
    expires: new Date(Date.now() + sevenDaysInMs),
    httpOnly: false,
  });
  console.log(response);
  res.redirect("/");
}

//
