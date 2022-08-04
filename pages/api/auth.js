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
                assembleId: response.user_id
            }
        }); // we need to handle user creation here, or migrate everyone's emails
        // also, we need to ensure that emails are unique
        // another key we could use is the id_token or the user_id from Assemble ID
        console.log({ firstUser })
        cookies.set('scrapbook_user_auth_id', firstUser.id, {
            overwrite: true,
            expires: new Date(Date.now() + sevenDaysInMs),
            httpOnly: !exposeIdToFrontend,
        });
    } catch (err) {
      try {
        await prisma.account.create({
          data: {
            assembleId: response.user_id,
            email: response.user_email,
            username: ((email => {
              return (Math.floor(Math.random() * 10000) + '').substring(0, 4) + email.split('@')[0] + '.' + email.split('@')[1].split('.').join('');
            })(response.user_email).split('').filter(char => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_.-'.split('').includes(char)).join('').substring(0, 20) || Math.floor(Math.random() * 100000) + '').padStart(3, '0'),
          }
        });
        const firstUser = await prisma.account.findFirst({
            where: {
                assembleId: response.user_id
            }
        });
        console.log({ firstUser })
        cookies.set('scrapbook_user_auth_id', firstUser.id, {
            overwrite: true,
            expires: new Date(Date.now() + sevenDaysInMs),
            httpOnly: !exposeIdToFrontend,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).send(`It looks like your user already exists. ID: ${response.user_id}, EMAIL: ${response.user_email}. Please DM this error to an Assemble team member.`);
      }
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
  const path = cookies.get('assemble_continue');
  if (path) {
    cookies.set('assemble_continue', '', {
      overwrite: true,
      expires: new Date(Date.now()),
      httpOnly: true
    });
    return res.redirect(path);
  }
  res.redirect("/");
}

//
