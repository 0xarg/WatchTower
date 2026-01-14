"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return <div>{id}</div>;
}

export default function Page() {
  return (
    <Suspense fallback="Loading...">
      <PageContent />
    </Suspense>
  );
}
