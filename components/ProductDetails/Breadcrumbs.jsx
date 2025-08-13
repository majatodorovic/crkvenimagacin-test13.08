"use client";
import Link from "next/link";
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { get } from "@/api/api";
import { Suspense } from "react";

const Breadcrumbs = ({ id, categoryId }) => {
  const { data: breadcrumbs } = useSuspenseQuery({
    queryKey: ["breadcrumbs", id],
    queryFn: async () => {
      return await get(
        `/product-details/breadcrumbs/${id}?categoryId=${categoryId ?? "*"}`,
      ).then((res) => res?.payload);
    },
    refetchOnWindowFocus: false,
  });

  return (
    <Suspense
      fallback={<div className={`h-2 w-full animate-pulse bg-slate-300`} />}
    >
      <div className="relative w-full">
        <div className="absolute left-0 top-0 -z-10 h-[350px] w-full bg-primary"></div>
        <div className="sectionPaddingX pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pt-10">
            <Link href={`/`} className={`text-[12px] text-white`}>
              Početna
            </Link>
            {(breadcrumbs?.steps ?? [])?.map((breadcrumb) => {
              return (
                <div className="flex" key={breadcrumb?.id}>
                  <span className="mr-2 text-[12px] text-white">/</span>
                  <Link
                    href={`/${breadcrumb?.link?.link_path}`}
                    className={`whitespace-nowrap text-[12px] text-white`}
                  >
                    {breadcrumb?.name}
                  </Link>
                </div>
              );
            })}
            <span className="text-[12px] text-white">/</span>
            <div
              className={`whitespace-nowrap text-[12px] text-white underline`}
            >
              {breadcrumbs?.end?.name}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Breadcrumbs;
