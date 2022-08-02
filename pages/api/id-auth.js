export default function IDAuth (req, res) {
    res.redirect(`/api/auth?auth_code=${encodeURIComponent(req.query.auth_code)}`);
} 
