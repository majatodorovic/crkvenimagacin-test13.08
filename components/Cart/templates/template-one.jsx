import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";
import BreadcrumbsStatic from "@/components/BreadcrumbsStatic/BreadcrumbsStatic";

export const TemplateOne = ({ verifyCaptcha, children }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.CAPTCHAKEY}>
      <GoogleReCaptcha onVerify={verifyCaptcha} refreshReCaptcha={true} />
      <BreadcrumbsStatic breadcrumbs={[{ name: "Korpa", url: "/korpa" }]} />
      <div className="sectionPaddingX">
        <div className="sectionPaddingX sectionPaddingT grid grid-cols-6 gap-x-3 gap-y-3 bg-white 2xl:!px-[60px]">
          <div className="col-span-6 max-xl:row-start-1">{children}</div>
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
};
