"use client";
import { Fragment, Suspense } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRecommendedProducts } from "@/hooks/ecommerce.hooks";
import ThumbByViewport from "@/components/Thumb/ThumbByViewport";

const RecommendedProducts = ({ text = "Preporučeni proizvodi", id }) => {
  const { data: productDetails } = useRecommendedProducts({ id });

  return (
    <>
      {productDetails?.items?.length > 0 && (
        <div className="sectionPaddingX mt-20 2xl:mt-[120px]">
          <div className="text-lg text-gold lg:text-[20px]">
            Crkveni Magacin
          </div>
          <h2 className="titleH2 text-left">{text}</h2>
          <div className="mt-10 2xl:mt-12">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
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
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
                1440: {
                  slidesPerView: 3.5,
                  spaceBetween: 40,
                },
              }}
            >
              {productDetails?.items?.map(({ id }) => {
                return (
                  <Fragment key={id}>
                    <Suspense
                      fallback={
                        <SwiperSlide className="aspect-2/3 h-full w-full animate-pulse bg-slate-300" />
                      }
                    >
                      <SwiperSlide key={id} className="hoveredColor">
                        <ThumbByViewport
                          id={id}
                          apiLink={`/product-details/thumb/${id}?categoryId=*`}
                        />
                      </SwiperSlide>
                    </Suspense>
                  </Fragment>
                );
              })}
              <div className="absolute right-0 top-0 z-50 h-full sm:shadow-white-glow-lg" />
              <div className="swiper-pagination !relative !bottom-0 !left-0 mt-10 flex !w-auto w-full items-center justify-center"></div>
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default RecommendedProducts;
