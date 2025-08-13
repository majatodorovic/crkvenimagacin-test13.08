import RenderSlider from "./RenderSlider";

const Slider = ({ banners, mobileBanners }) => {
  return (
    <div data-aos="fade-up" className="marginBottomSection relative">
      <div className="absolute left-0 top-0 -z-10 h-[90%] w-full bg-primary"></div>
      <div className={`max-md:hidden`}>
        {banners && <RenderSlider banners={banners} />}
      </div>
      <div className={`md:hidden`}>
        {mobileBanners && <RenderSlider banners={banners} />}
      </div>
    </div>
  );
};

export default Slider;
