import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loader from "./Loader";

const CALL_BACK_URL_KEY = "pcloud_authCallback";
export default function AuthCheck({
  children,
}: {
  children: React.ReactChild;
}) {
  const { user, error, isLoading } = useUser();
  const router = useRouter()

  const notLoggedIn = !isLoading && !user
  useEffect(() => {
    if (user) {
      const callbackUrl = localStorage.getItem(CALL_BACK_URL_KEY);
      if (callbackUrl) {
        localStorage.removeItem(CALL_BACK_URL_KEY);
        location.href = callbackUrl;
      }
    }
  })

  if (isLoading || error || !user) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line */}
        {isLoading ? <Loader /> : <a onClick={() => {
          localStorage.setItem(CALL_BACK_URL_KEY, location.href);
          location.href = "/api/auth/login";
        }} style={{fontSize: 30}} href="/api/auth/login">Log In</a>}
      </div>
    );
  }
  return <div>{children}</div>;
}
