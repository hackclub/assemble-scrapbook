import getAuthorizeURL from "../lib/server/auth.js";
import { useEffect } from "react";

export default function Login({ loginUrl, error }) {
  useEffect(() => {
    (async () => {
      try {
        let cookie = await fetch("/api/get-auth-state").then((response) =>
          response.json()
        );
        if (cookie == "TRUE" && !error) {
          location.replace("/");
        } else {
          location.replace(loginUrl);
        }
      } catch (err) {
        location.replace(loginUrl);
      }
    })();
  }, []);
  return (
      <div>
        <h1 sx={{ color: "white" }}>Redirecting...</h1>
        <br />
        <div sx={{ color: "white" }}>
          Not working?{" "}
          <a
            href={loginUrl}
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            Click here
          </a>{" "}
          to access it.
        </div>
        {error && <div>{error}</div>}
      </div>
  );
}

export function getServerSideProps(ctx) {
  const props = {
    loginUrl: getAuthorizeURL(ctx.req, ctx.res, ctx.query),
    error: ctx?.query?.error?.toString() || "",
  };

  return {
    props,
  };
}
