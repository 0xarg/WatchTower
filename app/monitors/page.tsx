import { createClient } from "@/lib/supabase/server";
import React, { Suspense } from "react";

const page = async () => {
  const supabase = await createClient();
  //   const { data, error } = await supabase.f;

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Monitors</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
        {/* <Suspense>{JSON.stringify(data, null, 2)}</Suspense> */}
      </pre>
    </div>
  );
};

export default page;
