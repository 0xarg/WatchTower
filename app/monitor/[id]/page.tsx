import MonitorClient from "./MonitorClient";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <MonitorClient id={params.id} />;
}
