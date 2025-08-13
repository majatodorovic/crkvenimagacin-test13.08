"use client";

import ProductPrice from "@/components/ProductPrice/ProductPrice";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const BannerWithProduct = ({ banners, products }) => {
  const sortedBanners = [...banners].sort((a, b) => b.id - a.id).slice(0, 1);
  const sortedProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 1);
  const product = sortedProducts[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="marginBottomSection bg-[#F8F7F6]" data-aos="fade-up">
      <div className="relative mx-auto flex h-full w-full max-w-[1920px] flex-col xl:max-h-[780px] xl:flex-row">
        {sortedBanners.map((banner) => (
          <Link
            href={banner?.url ?? "/"}
            key={banner.id}
            className="group w-full overflow-hidden xl:w-1/2"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              width={960}
              height={780}
              className="w-full object-cover"
            />
          </Link>
        ))}
        <div className="flex w-full px-6 py-8 max-lg:gap-4 max-md:flex-col sm:pr-8 lg:pr-10 xl:w-1/2 xl:pl-[275px] 2xl:pr-[70px]">
          <div className="flex items-center max-xl:min-w-[350px] xl:absolute xl:left-1/2 xl:top-1/2 xl:z-10 xl:max-w-[340px] xl:-translate-x-1/2 xl:-translate-y-1/2 2xl:max-w-[400px]">
            <Image
              src={product.image[selectedImageIndex]}
              alt={`${product.basic_data.name} ${selectedImageIndex + 1}`}
              width={440}
              height={350}
              className="max-md:max-w-auto !aspect-[4/5] h-full max-h-[400px] w-full object-cover max-xl:max-w-[300px] max-md:max-w-[250px] xl:ml-2 2xl:max-h-[480px]"
            />
            <div className="flex flex-col gap-2">
              {product.image.map((img, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-9 w-9 rounded-[5px] border-2 bg-white transition-all ${
                      selectedImageIndex === index
                        ? "border-gold"
                        : "border-[##E8E8E8]"
                    }`}
                  >
                    {selectedImageIndex === index && (
                      <div className="absolute -left-[25px] top-1/2 z-20 h-[1px] w-[30px] -translate-y-1/2 bg-gold" />
                    )}
                    <Image
                      src={img}
                      alt={`${product.basic_data.name} thumbnail ${index + 1}`}
                      width={36}
                      height={36}
                      className="h-full w-full rounded-[3px] object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            {product?.price?.discount?.active ? (
              <div className="w-fit">
                <div className="rounded-sm bg-[#2CC25D] px-4 py-0.5 text-[13px] font-bold text-white">
                  -
                  {Math.ceil(
                    ((product?.price?.price?.original -
                      product?.price?.price?.discount) /
                      product?.price?.price?.original) *
                      100,
                  )}
                  %
                </div>
              </div>
            ) : product?.price?.min?.price?.original &&
              product.price?.min?.price?.discount ? (
              <div className="w-fit">
                <div className="rounded-sm bg-[#2CC25D] px-4 py-0.5 text-[13px] font-bold text-white">
                  -
                  {Math.ceil(
                    ((product?.price?.price?.original -
                      product?.price?.price?.discount) /
                      product?.price?.price?.original) *
                      100,
                  )}
                  %
                </div>
              </div>
            ) : null}
            <div className="mt-5 text-[17px] font-medium uppercase text-gold">
              Najbolja ponuda
            </div>
            <div className="mt-1 text-[30px] font-semibold leading-[normal] text-black">
              {product?.basic_data?.name}
            </div>
            <div className="mb-8 mt-7 text-[15px] leading-[normal]">
              {product?.basic_data?.short_description}
            </div>
            <ProductPrice
              price={product?.price}
              inventory={product?.inventory}
              is_details={false}
            />
            <div className="mt-8">
              <Link href={`${product?.slug_path}`}>
                <div className="mainButton !w-full !max-w-[270px] !py-4 text-center !text-sm">
                  Pogledajte proizvod
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerWithProduct;
