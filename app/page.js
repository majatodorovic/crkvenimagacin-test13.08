import { get, list } from "@/api/api";
import { headers } from "next/headers";
import { generateOrganizationSchema } from "@/_functions";
import Products from "./homepage/components/Products/Products";
import Slider from "./homepage/components/Slider/Slider";
import Benefits from "./homepage/components/Benefits/Benefits";
import RecommendedBanners from "./homepage/components/RecommendedBanners/RecommendedBanners";
import BannersWithProducts from "./homepage/components/BannersWithProducts/BannersWithProducts";
import News from "./homepage/components/News/News";
import BannerWithProduct from "./homepage/components/BannerWithProduct/BannerWithProduct";

const getSliders = () => {
  return get("/banners/index_slider").then((res) => res?.payload);
};
const getMobileSliders = () => {
  return get("/banners/index_slider_mobile").then((res) => res?.payload);
};
const getRecommendedProducts = () => {
  return list("/products/section/list/recommendation").then(
    (res) => res?.payload?.items,
  );
};
const getBestSellingProducts = () => {
  return list("/products/section/list/best_sell").then(
    (res) => res?.payload?.items,
  );
};
const getNewProducts = () => {
  return list("/products/section/list/new_arrival").then(
    (res) => res?.payload?.items,
  );
};
const getPositionProducts = () => {
  return list("/products/section/list/position").then(
    (res) => res?.payload?.items,
  );
};
const getTopSellersProducts = () => {
  return list("/products/section/list/top_sellers").then(
    (res) => res?.payload?.items,
  );
};
const getBannersOne = () => {
  return get("/banners/banner_1").then((res) => res?.payload);
};
const getBannersTwo = () => {
  return get("/banners/banner_2").then((res) => res?.payload);
};
const getBannersThree = () => {
  return get("/banners/banner_3").then((res) => res?.payload);
};
const getBannerFour = () => {
  return get("/banners/banner_4").then((res) => res?.payload);
};
const getAllNews = async () => {
  return await list(`/news/category/list/all`).then(
    (res) => res?.payload?.items,
  );
};

const Home = async () => {
  const [sliders, mobileSliders] = await Promise.all([
    getSliders(),
    getMobileSliders(),
  ]);
  const bannersOne = await getBannersOne();
  const bannersTwo = await getBannersTwo();
  const recommendedProducts = await getRecommendedProducts();
  const bestSellingProducts = await getBestSellingProducts();
  const newProducts = await getNewProducts();
  const allNews = await getAllNews();
  const bannersThree = await getBannersThree();
  const positionProducts = await getPositionProducts();
  const bannerFour = await getBannerFour();
  const topSellersProducts = await getTopSellersProducts();
  let all_headers = headers();
  let base_url = all_headers.get("x-base_url");

  let schema = generateOrganizationSchema(base_url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="relative block overflow-hidden">
        <div className="relative block" id="slider">
          <Slider banners={sliders} mobileBanners={mobileSliders} />
        </div>
        <Benefits />
        {(bannersOne?.length > 0 || bannersTwo?.length > 0) && (
          <RecommendedBanners bannersOne={bannersOne} bannersTwo={bannersTwo} />
        )}
        <Products
          recommendedProducts={recommendedProducts}
          bestSellingProducts={bestSellingProducts}
          newProducts={newProducts}
        />
        {bannerFour.length > 0 && (
          <BannerWithProduct
            banners={bannerFour}
            products={topSellersProducts}
          />
        )}
        {(bannersThree.length > 0 || positionProducts.length > 0) && (
          <BannersWithProducts
            products={positionProducts}
            banners={bannersThree}
          />
        )}
        <News news={allNews} />
      </div>
    </>
  );
};

export default Home;

export const revalidate = 30;

const getSEO = () => {
  return get("/homepage/seo").then((response) => response?.payload);
};

export const generateMetadata = async () => {
  const data = await getSEO();
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: data?.meta_title ?? "Početna | Crkveni Magacin",
    description: data?.meta_description ?? "Dobrodošli na Crkveni Magacin",
    alternates: {
      canonical: data?.meta_canonical_link ?? canonical,
    },
    robots: {
      index: data?.meta_robots?.index ?? true,
      follow: data?.meta_robots?.follow ?? true,
    },
    openGraph: {
      title: data?.social?.share_title ?? "Početna | Crkveni Magacin",
      description:
        data?.social?.share_description ?? "Dobrodošli na Crkveni Magacin",
      type: "website",
      images: [
        {
          url:
            data?.social?.share_image ??
            "https://www.crkvenimagacin.rs/images/logo/logo.png",
          width: 800,
          height: 600,
          alt: "Crkveni Magacin",
        },
      ],
      locale: "sr_RS",
    },
  };
};
