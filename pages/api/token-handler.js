import fetch from 'node-fetch';

export default async function tokenHandler (req, res) {
    const url = `https://api.id.assemble.hackclub.com/oauth/token?auth_code=${encodeURIComponent(req.body.code)}&code_verifier=${encodeURIComponent(req.body.code_verifier)}&method=S256`;
    const response = await fetch(url).then(resp => resp.json());
    res.json(response);
}