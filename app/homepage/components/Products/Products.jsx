"use client";
import { Suspense, useEffect, useState } from "react";
import { Thumb } from "@/components/Thumb/Thumb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Products = ({
  recommendedProducts,
  bestSellingProducts,
  newProducts,
}) => {
  // Define the three titles
  const titles = [
    { id: "new", name: "Najnovije", products: newProducts },
    {
      id: "recommended",
      name: "Izdavajmo",
      products: recommendedProducts,
    },
    {
      id: "bestSelling",
      name: "Najprodavanije",
      products: bestSellingProducts,
    },
  ];

  const [selectedTitle, setSelectedTitle] = useState("new");
  const [products, setProducts] = useState(recommendedProducts);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recommendedProducts) {
      setLoading(false);
    }
  }, [recommendedProducts]);

  // Update products when selectedTitle changes
  useEffect(() => {
    const selectedTitleData = titles.find(
      (title) => title.id === selectedTitle,
    );
    setProducts(selectedTitleData?.products || []);
  }, [selectedTitle, recommendedProducts, bestSellingProducts, newProducts]);

  return (
    <div className="sectionPaddingX marginBottomSection" data-aos="fade-up">
      <div className="text-lg text-gold lg:text-[20px]">Crkveni Magacin</div>
      <div className="flex items-end justify-between">
        <h2 className={`titleH2`}>Izdvojeni proizvodi</h2>
        <div className="flex flex-row flex-wrap items-center gap-2 max-lg:hidden">
          {titles.map((title, index) => (
            <div key={title.id} className="mb-1 flex items-center gap-2">
              <button
                className={
                  selectedTitle === title.id
                    ? `relative w-fit text-[17px] font-semibold text-gold`
                    : `relative w-fit text-[17px] font-semibold text-black hover:text-gold`
                }
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTitle(title.id);
                }}
              >
                {title.name}
              </button>
              {index < titles.length - 1 && (
                <span className="h-[5px] w-[5px] rounded-full bg-gold"></span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-6 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="lg:hidden">
          <select
            onChange={(e) => {
              setSelectedTitle(e.target.value);
            }}
            value={selectedTitle}
            className="w-full rounded-md border border-[#f6f6f6] text-black focus:border-primary focus:outline-0 focus:ring-0 max-md:text-[0.9rem]"
          >
            {titles.map((title) => (
              <option
                key={title.id}
                value={title.id}
                className={`max-md:text-[0.9rem]`}
              >
                {title.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {!loading && (
        <div className="mt-6 md:mt-[70px]">
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
            {products?.map(({ id }) => {
              return (
                <SwiperSlide key={id} className="hoveredColor">
                  <Suspense
                    fallback={
                      <div
                        key={id}
                        className="aspect-2/3 h-full w-full animate-pulse bg-slate-300"
                      />
                    }
                  >
                    <Thumb id={id} slug={id} light />
                  </Suspense>
                </SwiperSlide>
              );
            })}
            <div className="absolute right-0 top-0 z-50 h-full sm:shadow-white-glow-lg" />
            <div className="swiper-pagination !relative !bottom-0 !left-0 mt-10 flex !w-auto w-full items-center justify-center"></div>
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Products;
