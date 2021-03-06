import AuthCheck from "../components/AuthCheck";
import dynamic from "next/dynamic";
import { FullscreenLoader } from "../components/Loader";

const DashbaordInner = dynamic(() => import("../components/Dashboard"), {
  loading: () => <FullscreenLoader />,
});

export default function Dashbaord() {
  return (
    <AuthCheck>
      <DashbaordInner />
    </AuthCheck>
  );
}
