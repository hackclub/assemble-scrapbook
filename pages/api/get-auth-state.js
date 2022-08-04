import Cookies from "cookies";
import { getProfile } from './users/[username]/index'

export default async function (req, res) {
  return res.send((await check(req, res) + '').toUpperCase());
}

export async function check (req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("scrapbook_access_token");
  const token2 = cookies.get("scrapbook_user_auth_id");
  if (token && token2) {
    try {
      const user = await getProfile(token2, 'id');
      if (!user?.id) return false;
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
}