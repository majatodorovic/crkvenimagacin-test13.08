"use client";

import Image from "next/image";
import { Suspense } from "react";

const RecommendedBanners = ({ bannersOne, bannersTwo }) => {
  const bannerOne = bannersOne?.[0];
  const bannerTwo = bannersTwo?.[0];

  if (!bannerOne && !bannerTwo) {
    return null;
  }

  return (
    <div className="sectionPaddingX marginBottomSection" data-aos="fade-up">
      <div className="flex flex-col gap-6 lg:flex-row">
        {bannerOne && (
          <Suspense
            fallback={
              <div className="h-[500px] w-full animate-pulse bg-slate-300 lg:w-[440px] lg:min-w-[440px]" />
            }
          >
            <div className="group relative flex h-[500px] w-full flex-col justify-between overflow-hidden p-8 lg:w-[440px] lg:min-w-[440px]">
              <div>
                <div className="mb-5 text-left text-[30px] font-semibold text-white">
                  {bannerOne.title}
                </div>
                <div className="whitespace-pre-line text-left text-[15px] leading-[normal] text-white">
                  {bannerOne.text}
                </div>
                {bannerOne.image && (
                  <div className="absolute left-0 top-0 z-[-1] w-full">
                    <Image
                      src={bannerOne.image}
                      alt={bannerOne.title}
                      width={440}
                      height={500}
                      className="h-[500px] w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                    />
                  </div>
                )}
              </div>
              {bannerOne.button && (
                <div className="mainButton max-w-[270px] !text-center">
                  {bannerOne.button}
                </div>
              )}
            </div>
          </Suspense>
        )}
        {bannerTwo && (
          <Suspense
            fallback={
              <div className="h-[500px] w-full animate-pulse bg-slate-300" />
            }
          >
            <div className="group relative flex h-[500px] w-full flex-col justify-center overflow-hidden p-8">
              <div>
                <div className="mb-5 text-left text-[30px] font-semibold text-white">
                  {bannerTwo.title}
                </div>
                <div
                  className="text-left text-[15px] font-light text-white"
                  dangerouslySetInnerHTML={{ __html: bannerTwo.text }}
                />
                {bannerTwo.image && (
                  <div className="absolute left-0 top-0 z-[-1]">
                    <Image
                      src={bannerTwo.image}
                      alt={bannerTwo.title}
                      width={1310}
                      height={500}
                      className="h-[500px] w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                    />
                  </div>
                )}
              </div>
              {bannerTwo.button && (
                <div className="mainButton max-w-[270px] !text-center">
                  {bannerTwo.button}
                </div>
              )}
            </div>
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default RecommendedBanners;
