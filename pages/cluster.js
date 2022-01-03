import AuthCheck from "../components/AuthCheck";
import dynamic from "next/dynamic";
import { FullscreenLoader } from "../components/Loader";

const ClusterInner = dynamic(() => import("../components/Cluster"), {
  loading: () => <FullscreenLoader />,
});

export default function Cluster() {
  return (
    <AuthCheck>
      <ClusterInner />
    </AuthCheck>
  );
}
