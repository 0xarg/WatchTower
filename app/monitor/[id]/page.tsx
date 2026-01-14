"use client";
import React, { useCallback, useEffect } from "react";
type PageProps = {
  params: {
    id: string;
  };
};
const page = ({ params }: PageProps) => {
  const { id } = params;
  console.log(id);

  return <div>hi</div>;
};

export default page;
