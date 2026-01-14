"use client";

type Props = {
  id: string;
};

export default function MonitorClient({ id }: Props) {
  console.log(id);
  return <div>{id}</div>;
}
