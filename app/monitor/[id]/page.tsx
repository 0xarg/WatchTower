import MonitorClient from "./MonitorClient";

export default function Page({ params }: any) {
  return <MonitorClient id={params.id} />;
}
