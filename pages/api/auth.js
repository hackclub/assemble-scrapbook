export const exposeIdToFrontend = true;

import Cookies from "cookies";
import crypto from "node:crypto";
import fetch from "node-fetch";
import prisma from "../../lib/prisma";

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

    try {
        const firstUser = await prisma.account.findFirst({
            where: {
                email: response.user_email
            }
        });
        console.log({ firstUser })
        cookies.set('scrapbook_user_auth_id', firstUser.id, {
            overwrite: true,
            expires: new Date(Date.now() + sevenDaysInMs),
            httpOnly: !exposeIdToFrontend,
        });
    } catch (err) {
        
    }


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
