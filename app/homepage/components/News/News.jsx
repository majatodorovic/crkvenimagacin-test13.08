"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";

const News = ({ news }) => {
  return (
    <div className="sectionPaddingX w-full" data-aos="fade-up">
      <div className="relative overflow-hidden">
        <div className="flex max-md:flex-col max-md:gap-8">
          <div className="z-50 flex w-1/3 items-center bg-white max-md:w-full">
            <div className="absolute left-0 top-0 w-1/3 bg-white max-md:hidden"></div>
            <div className="flex flex-col md:w-[300px]">
              <div className="text-lg text-gold lg:text-[20px]">
                Crkveni Magacin
              </div>
              <h2 className="titleH2 text-left">Novo sa bloga</h2>
              <div className="relative mt-10 max-md:mb-4 max-md:mt-6">
                <div className="swiper-pagination !relative !bottom-0 !left-0 flex !w-auto"></div>
              </div>
            </div>
          </div>
          <div className="relative w-2/3 max-md:w-full">
            <Swiper
              slidesPerView={1}
              loop={true}
              modules={[Pagination]}
              pagination={{
                el: ".swiper-pagination",
                clickable: true,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 2.5,
                  spaceBetween: 26,
                },
                1680: {
                  slidesPerView: 2.5,
                  spaceBetween: 26,
                },
              }}
              className="relative !overflow-visible"
            >
              {news?.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="group relative flex h-full flex-col overflow-hidden">
                    <Link
                      href={`/vesti/${item.slug}`}
                      className="relative aspect-[7/8] overflow-hidden"
                    >
                      <Image
                        src={item.images.thumb_image}
                        alt={item.basic_data.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col py-3.5 pr-6">
                      <Link href={`/vesti/${item.slug}`}>
                        <h3 className="text-left text-lg font-light text-black transition-colors duration-300 group-hover:text-gold">
                          {item.basic_data.title}
                        </h3>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="absolute right-0 top-0 z-50 h-full sm:shadow-white-glow-lg" />
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
