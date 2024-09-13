import dynamic from "next/dynamic";

const NoSSRIntializeModal = dynamic(() => import("./InitializeModal"), {
  ssr: false,
});

export default function dynamicInitModal(props) {
  return <NoSSRIntializeModal {...props}/>;
}
