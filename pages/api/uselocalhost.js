import Cookies from "cookies";

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  const previousValue = cookies.get("assemble_use_localhost");
  const invertedValue = previousValue === "true" ? "false" : "true";
  const oneHrInMs = 60 * 60 * 1000;
  cookies.set("assemble_use_localhost", invertedValue, {
    overwrite: true,
    expires: new Date(Date.now() + oneHrInMs),
  });
  res.send(invertedValue);
}
