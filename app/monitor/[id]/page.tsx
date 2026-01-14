// app/monitor/[id]/page.tsx

import MonitorClient from "./MonitorClient";

export default function Page({ params }: { params: { id: string } }) {
  return <MonitorClient id={params.id} />;
}
