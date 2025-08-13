"use client";

import { Thumb } from "@/components/Thumb/Thumb";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const BannersWithProducts = ({ products, banners }) => {
  const sortedBanners = [...banners].sort((a, b) => b.id - a.id).slice(0, 2);
  const sortedProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 6);

  return (
    <div
      className="sectionPaddingX marginBottomSection flex flex-col gap-4 xl:flex-row"
      data-aos="fade-up"
    >
      <div className="flex w-full flex-col xl:w-2/3">
        <div className="text-lg text-gold lg:text-[20px]">Crkveni Magacin</div>
        <div className="flex items-end justify-between max-md:flex-col max-md:items-start max-md:gap-4">
          <h2 className="titleH2 text-left">Preporučeni proizvodi</h2>
          <Link
            href="/verski-proizvodi"
            className="mainButton !min-w-[270px] !py-4 text-center !text-sm"
          >
            Pogledajte sve proizvode
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <Suspense
              key={product.id}
              fallback={
                <div
                  key={product.id}
                  className="aspect-[7/8] h-full w-full animate-pulse bg-slate-300"
                />
              }
            >
              <Thumb id={product.id} slug={product.id} small />
            </Suspense>
          ))}
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col gap-8 sm:flex-row xl:w-1/3 xl:flex-col">
        {sortedBanners.map((banner) => (
          <Link
            href={banner?.url ?? "/"}
            key={banner.id}
            className="group relative aspect-square w-full overflow-hidden"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              width={500}
              height={500}
              className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
              <h3 className="text-[24px] font-light leading-normal text-white lg:text-[30px]">
                {banner.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BannersWithProducts;
