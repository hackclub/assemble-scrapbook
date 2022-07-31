export default function IDAuth (req, res) {
    res.redirect(`/api/auth/callback/assemble?code=${encodeURIComponent(req.query.auth_code)}`);
}