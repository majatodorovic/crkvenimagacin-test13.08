"use client";

import ProductPrice from "@/components/ProductPrice/ProductPrice";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import { get as GET } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { truncateText } from "@/helpers/truncateText";
import noImage from "../../public/images/placeholder.jpg";
import Wishlist from "../ProductDetails/Wishlist";

const ThumbByViewport = ({ id, apiLink, refreshWishlist }) => {
  const [isInView, setIsInView] = useState(false);
  const thumbRef = useRef(null);

  //IntersectionObserver for visibility detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 },
      );

      if (thumbRef.current) {
        observer.observe(thumbRef.current);
      }

      return () => {
        if (thumbRef.current) {
          observer.unobserve(thumbRef.current);
        }
      };
    }
  }, []);

  const { data: product } = useQuery({
    queryKey: ["productThumbByViewport", id],
    queryFn: async () => {
      return await GET(apiLink).then((res) => {
        return res?.payload;
      });
    },
    enabled: isInView,
    refetchOnWindowFocus: false,
  });

  const discount_number = Math.abs(
    product?.price?.min?.price?.original - product?.price?.min?.price?.discount,
  );
  const discount_percent = Math.ceil(
    (discount_number / product?.price?.min?.price?.original) * 100,
  );

  const imageList =
    product?.image_data?.length > 0
      ? product.image_data
      : [
          {
            url: noImage,
            descriptions: { alt: "No Image" },
            file_data: { width: 800, height: 800 },
          },
        ];

  return (
    <div
      ref={thumbRef}
      className="group relative col-span-1 flex h-full flex-col items-stretch rounded-xl border-2 border-[#f6f6f6] transition-all duration-300 hover:shadow-[2px_2px_15px_0_rgba(0,0,0,0.10)]"
    >
      <div
        className={`relative !aspect-[7/8] overflow-hidden border-b-2 border-[#f6f6f6] px-[75px] pb-5 pt-9`}
      >
        <Swiper
          modules={[Navigation, Pagination]}
          rewind
          className="categoryImageSwiper relative h-full w-full"
        >
          {imageList.map(({ url, descriptions: { alt } }, index) => (
            <SwiperSlide key={index} className="!relative !overflow-hidden">
              <Link
                href={`/${product?.link?.link_path}`}
                className="cursor-pointer"
              >
                <Image
                  ref={thumbRef}
                  loading="lazy"
                  src={url === noImage ? url : convertHttpToHttps(url ?? "")}
                  alt={alt ?? product?.basic_data?.name}
                  sizes="(max-width: 639px) 100vw, (max-width: 767px) 100vw, (max-width: 1023px) 100vw, (max-width: 1279px) 100vw, (min-width: 1600px) 50vw"
                  width={0}
                  height={0}
                  fill
                  className={`h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110`}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        {product?.price?.discount?.active ? (
          <div className="absolute left-6 top-5 z-[1] font-bold text-white">
            <div className="rounded-sm bg-[#2CC25D] px-4 py-0.5 text-[13px]">
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
          product?.price?.min?.price?.discount ? (
          <div className="absolute left-6 top-5 z-[1] font-bold text-white">
            <div className="rounded-sm bg-[#2CC25D] px-4 py-0.5 text-[13px]">
              -{discount_percent}%
            </div>
          </div>
        ) : null}
        {product?.stickers?.length > 0 && (
          <div
            className={`absolute right-6 top-5 z-[1] flex flex-col gap-2 text-center text-white`}
          >
            {product?.stickers?.map((sticker, index) => (
              <div
                className={`bg-primary px-2 py-0.5 text-base font-light 2xl:px-4 2xl:text-lg`}
                key={index}
              >
                {sticker?.name}
              </div>
            ))}
          </div>
        )}
        <div className="absolute bottom-0 left-0 z-[10] flex h-[50px] w-full items-center border-t-2 border-t-[#f6f6f6] transition-all duration-300 group-hover:opacity-100 md:opacity-0">
          <div className="flex h-full w-1/3 items-center justify-center bg-white">
            <Wishlist
              product={product}
              withText={false}
              refreshWishlist={refreshWishlist}
            />
          </div>
          <Link
            href={`/${product?.link?.link_path}`}
            className="linkGroup group flex h-full w-2/3 items-center justify-center gap-2 bg-gold text-base text-primary hover:bg-primary hover:text-white"
          >
            <Image
              src="/icons/trolley.svg"
              alt="Dodajte u korpu"
              width={20}
              height={20}
              className="primaryFilter primaryFilterHover mb-1 h-6 w-6 min-w-6"
            />
            Dodajte u korpu
          </Link>
        </div>
      </div>
      <div className={`z-[50] flex flex-col px-5 pb-6 pt-4`}>
        <div className="relative mb-1 flex items-center justify-start">
          <Link
            href={`/${product?.link?.link_path}`}
            className={`relative mb-[26px] cursor-pointer max-sm:line-clamp-1 sm:line-clamp-2`}
          >
            <h3
              className="h-[40px] text-left text-base leading-[normal] text-primary group-hover:text-gold"
              title={
                product?.basic_data?.name.length > 63
                  ? product?.basic_data?.name
                  : ""
              }
            >
              {truncateText(product?.basic_data?.name)}
            </h3>
          </Link>
        </div>
        <ProductPrice
          price={product?.price}
          inventory={product?.inventory}
          is_details={false}
        />
      </div>
    </div>
  );
};

export default ThumbByViewport;
