import AuthCheck from "../components/AuthCheck";
import dynamic from "next/dynamic";
import { FullscreenLoader } from "../components/Loader";

const RegisterInner = dynamic(() => import("../components/Register"), {
  loading: () => <FullscreenLoader />,
});

export default function Register() {
  return (
    <AuthCheck>
      <RegisterInner />
    </AuthCheck>
  );
}
