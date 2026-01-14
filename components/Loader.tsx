import React from "react";
import { LoaderFive } from "@/components/ui/loader";

export function Loader() {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <LoaderFive text="Loading..." />;
    </div>
  );
}
