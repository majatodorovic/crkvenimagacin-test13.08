"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { FreeMode, Navigation, Pagination, Zoom } from "swiper/modules";
import Image from "next/image";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import { useSearchParams } from "next/navigation";
import { getCurrentGalleryByVariantKeys } from "@/components/ProductDetails/helpers/gallery";

export const ProductGallery = ({ productGallery, variantKeyArray }) => {
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState(
    productGallery?.gallery.length > 0
      ? productGallery?.gallery
      : [
          {
            image: "/images/placeholder.jpg",
          },
        ],
  );

  useEffect(() => {
    if (variantKeyArray) {
      const currentGallery = variantKeyArray
        ? getCurrentGalleryByVariantKeys({
            variantKeys: variantKeyArray,
            productGallery,
          })
        : [];

      if (currentGallery.length > 0) {
        setGallery(currentGallery);
      }
    }
  }, [variantKeyArray]);

  const params = useSearchParams();
  const color = params?.get("color");

  function ImageMagnifier({
    src,
    magnifierHeight = 300,
    magnifierWidth = 300,
    zoomLevel = 2.5,
    onClick = () => {},
  }) {
    const [[x, y], setXY] = useState([0, 0]);

    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

    const [showMagnifier, setShowMagnifier] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          zIndex: 100,
        }}
        className="aspect-square h-full w-full object-cover"
        onClick={onClick}
      >
        <Image
          src={src}
          width={0}
          height={0}
          ref={mainSliderRef}
          sizes={`(max-width: 768px) 100vw, (min-width: 1200px) 70vw`}
          priority={true}
          className="!h-full w-full bg-lightGray !object-cover"
          onMouseEnter={(e) => {
            const elem = e.currentTarget;
            const { width, height } = elem.getBoundingClientRect();
            setSize([width, height]);
            setShowMagnifier(true);
          }}
          onMouseMove={(e) => {
            const elem = e.currentTarget;
            const { top, left } = elem.getBoundingClientRect();
            const x = e.pageX - left - window.pageXOffset;
            const y = e.pageY - top - window.pageYOffset;
            setXY([x, y]);
          }}
          onMouseLeave={() => {
            setShowMagnifier(false);
          }}
          alt={`Croonus Shop`}
        />

        <div
          style={{
            display: showMagnifier ? "" : "none",
            position: "absolute",
            pointerEvents: "none",
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifierWidth / 2}px`,
            opacity: "1",
            border: "1px solid lightgray",
            borderRadius: "50%",
            backgroundColor: "white",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgWidth * zoomLevel}px ${
              imgHeight * zoomLevel
            }px`,
            backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
          }}
        ></div>
      </div>
    );
  }

  const [modalImage, setModalImage] = useState(null);

  const productImage = gallery?.map((image, index) => {
    return (
      <SwiperSlide
        key={index}
        className="relative w-full overflow-hidden rounded-[10px] border border-[#F0F0F0] px-14 py-8"
      >
        <ImageMagnifier
          src={convertHttpToHttps(image?.image)}
          onClick={() => {
            setModalImage(image?.image);
          }}
          className="bg-lightGray"
        />
      </SwiperSlide>
    );
  });

  useEffect(() => {
    if (color) {
      setLoading(true);
      const newImages = productGallery?.gallery?.filter((item) =>
        item?.variant_key?.includes(color),
      );

      const nonVariantImages = productGallery.gallery?.filter(
        (item) => item?.variant_key_array?.length === 0,
      );

      setGallery([...newImages, ...nonVariantImages]);
    }
    if (productGallery?.gallery?.length) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [color]);

  const mainSliderRef = useRef(null);

  return (
    <div className="h-fit w-full gap-10 overflow-hidden max-md:mx-auto max-md:max-w-[350px] md:flex md:w-1/2 md:flex-col lg:w-[35%]">
      <Swiper
        spaceBetween={10}
        pagination={true}
        modules={[FreeMode, Pagination, Navigation]}
        initialSlide={0}
        navigation={true}
        rewind={true}
        className={`!relative !aspect-[3/4] h-full w-full`}
        breakpoints={{
          768: {
            direction: "horizontal",
            slidesPerView: 1,
            pagination: {
              el: ".swiper-pagination",
              enabled: false,
            },
            navigation: {
              enabled: false,
            },
            modules: [FreeMode, Navigation],
          },
          0: {
            direction: "vertical",
            slidesPerView: 1,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
              enabled: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            },
            navigation: {
              clickable: false,
              enabled: false,
            },
            modules: [FreeMode, Pagination],
          },
        }}
      >
        {loading ? (
          <SwiperSlide>
            <div className="aspect-[3/4] h-full w-full animate-pulse bg-gray-200"></div>
          </SwiperSlide>
        ) : (
          <>{productImage}</>
        )}
        <div className={`absolute right-2 top-2 z-50 flex flex-col gap-1`}>
          {productGallery?.stickers?.length > 0 &&
            productGallery?.stickers?.map((sticker, stickerIndex) => {
              return (
                <div
                  key={`stickerIndex-${stickerIndex}`}
                  className={`bg-primary px-[0.85rem] py-1 text-[13px] font-bold`}
                >
                  <span className={`text-[0.75rem] text-white`}>
                    {sticker?.name}
                  </span>
                </div>
              );
            })}
        </div>
      </Swiper>
      {modalImage && (
        <div
          className={`fixed left-0 top-0 z-[999999] flex h-full w-full items-center justify-center bg-black/80 md:hidden`}
        >
          <div className="relative h-full w-full">
            <Swiper
              modules={[Pagination, Zoom]}
              pagination={true}
              direction={"vertical"}
              zoom={{
                maxRatio: 2.5,
                toggle: true,
                minRatio: 1,
              }}
              initialSlide={gallery?.findIndex(
                (item) => item?.image === modalImage,
              )}
              className={`modalSwiper swiper-zoom-container h-full w-full`}
              breakpoints={{
                0: {
                  direction: "vertical",
                  slidesPerView: 1,
                  pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    enabled: true,
                    bulletClass: "swiper-pagination-bullet",
                    bulletActiveClass: "swiper-pagination-bullet-active",
                  },
                },
              }}
            >
              {gallery?.map((image, index) => {
                return (
                  <SwiperSlide
                    key={`${index}-product-image-first-swiper`}
                    className="w-full"
                  >
                    <div className="swiper-zoom-container">
                      <Image
                        src={image?.image}
                        alt={
                          image?.image_data?.description?.alt || "Croonus shop"
                        }
                        fill
                        sizes="100vw"
                        objectFit="cover"
                        priority={true}
                        className="h-auto w-full cursor-pointer"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <i
            className={`fas fa-times absolute left-2 top-2 z-50 cursor-pointer rounded-xl bg-white px-2 py-1 text-xl text-[#e10000]`}
            onClick={() => {
              setModalImage(null);
            }}
          ></i>
        </div>
      )}
    </div>
  );
};
