"use client";
import React, { useCallback, useEffect } from "react";
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};
const page = ({ params }: PageProps) => {
  const loadData = useCallback(async () => {
    const { id } = await params;
    console.log(id);
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return <div>hi</div>;
};

export default page;
