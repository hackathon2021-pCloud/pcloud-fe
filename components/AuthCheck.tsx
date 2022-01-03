import { useUser } from "@auth0/nextjs-auth0";
import Loader from "./Loader";

export default function AuthCheck({
  children,
}: {
  children: React.ReactChild;
}) {
  const { user, error, isLoading } = useUser();

  if (isLoading || error || !user) {
    return (
      <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Loader />
      </div>
    );
  }
  return <div>{children}</div>;
}
