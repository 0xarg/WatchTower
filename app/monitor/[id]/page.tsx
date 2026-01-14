"use client";

import { useSearchParams } from "next/navigation";

export default function Page() {
  const queryParams = useSearchParams();
  const id = queryParams.get("id");
  console.log(id);

  return <>{id}</>;
}
