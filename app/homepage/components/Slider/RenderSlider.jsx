"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import { Autoplay } from "swiper/modules";
import Aos from "aos";

function extractYoutubeId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(regex);
  return match ? match[1] : null;
}

const RenderBanner = ({ banner }) => {
  switch (banner.type) {
    case "image": {
      return (
        <Image
          src={banner?.image ?? "/"}
          alt={banner?.title ?? "Alt"}
          width={banner?.width}
          height={banner?.height}
          // sizes={`100vw`}
          // className="h-auto"
          priority
        />
      );
    }
    case "video_link": {
      const videoProvider = banner.video_provider;
      const videoUrl = banner.video_url;

      const src =
        videoProvider === "youtube"
          ? `https://www.youtube.com/embed/${extractYoutubeId(
              videoUrl,
            )}?autoplay=1&mute=1&loop=1&playsinline=1&controls=0&playlist=${extractYoutubeId(
              videoUrl,
            )}`
          : `${videoUrl}?autoplay=1&muted=1&loop=1&background=1&playsinline=1}`;

      return (
        <iframe
          className="pointer-events-none aspect-[960/1550] h-full w-full object-cover md:aspect-[1920/800]"
          width={banner.width}
          height={banner.height}
          src={src}
          style={{ border: "none" }}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
    case "video": {
      return (
        <>
          <video
            key={banner?.file}
            width={banner?.file_data?.banner_position?.width}
            height={banner?.file_data?.banner_position?.height}
            className="h-full w-full bg-fixed object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
          >
            <source src={convertHttpToHttps(banner?.file)} type="video/mp4" />
            <source
              src={convertHttpToHttps(banner?.file.replace(".mp4", ".webm"))}
              type="video/webm"
            />
            Your browser does not support the video tag.
          </video>
        </>
      );
    }
    default:
      break;
  }
};

const RenderSlider = ({ banners }) => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    swiperRef.current?.swiper.slideTo(index);
  };

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="sectionPaddingX relative h-[750px] sm:h-[850px] md:h-[600px] lg:h-[660px]">
      <div className="absolute left-0 top-0 -z-10 h-[90%] w-full bg-primary"></div>
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={banners.length > 1}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="h-full"
      >
        {banners?.map((banner, index) => (
          <SwiperSlide key={index} className="h-full">
            <div className="absolute z-30 -translate-x-1/2 -translate-y-1/2 max-md:left-1/2 max-md:top-3/4 md:left-3/4 md:top-1/2">
              <RenderBanner banner={banner} />
            </div>
            <div className="absolute bottom-0 z-20 h-1/4 w-full bg-gold transition-all duration-500 max-md:left-0 md:right-0 md:top-0 md:h-full md:w-1/4"></div>
            <Link
              href={banner?.url ?? "/"}
              target={banner?.target ?? "_self"}
              className="absolute left-0 top-0 z-10 h-full w-full bg-[#F6F7FB] transition-all duration-500"
            >
              <div className="absolute left-6 top-[80px] flex max-w-[400px] transform flex-col gap-4 text-left md:left-10 md:left-[70px] md:top-1/2 md:max-w-[350px] md:-translate-y-1/2 lg:max-w-[450px] xl:left-[100px] xl:max-w-[520px]">
                {banner?.title && (
                  <h1
                    className="text-[32px] font-bold leading-[normal] text-[#1B1818] lg:text-[50px]"
                    dangerouslySetInnerHTML={{ __html: banner?.title }}
                  />
                )}
                <div className="h-[1px] w-[230px] bg-gold" />
                {banner?.text && (
                  <p
                    className="text-base text-[#373737]"
                    dangerouslySetInnerHTML={{ __html: banner?.text }}
                  ></p>
                )}
                {banner?.button && (
                  <button className="mainButton mt-7 max-w-[270px] !py-4 !text-sm md:mt-0 lg:mt-7">
                    {banner?.button}
                  </button>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute bottom-3 left-10 z-[50] flex items-center gap-1 md:left-[140px] lg:bottom-12 xl:left-[170px]">
        {banners?.map((banner, index) => (
          <div
            key={index}
            className={`mx-1 flex h-[14px] w-[14px] cursor-pointer items-center justify-center`}
            onClick={() => handleSlideChange(index)}
          >
            <div
              className={`h-[14px] w-[14px] rounded-full ${
                currentSlide === index
                  ? "!h-[14px] !w-[14px] bg-primary md:bg-gold"
                  : "bg-[#D9D9D9]"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderSlider;
