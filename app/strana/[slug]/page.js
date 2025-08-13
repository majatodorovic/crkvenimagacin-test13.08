import { get, list } from "@/api/api";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import BreadcrumbsStatic from "@/components/BreadcrumbsStatic/BreadcrumbsStatic";
import StaticPage from "@/app/strana/[slug]/components/StaticPage";

const getData = (slug) => {
  return list(`/static-pages/content/${slug}`).then((res) => {
    return res?.payload;
  });
};

const DynamicStaticPage = async ({ params: { slug } }) => {
  const data = await getData(slug);
  data ?? notFound();

  const formatText = (text) => {
    const sentence = text.replace(/-/g, " ").toLowerCase();
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  };

  return (
    <div>
      <BreadcrumbsStatic
        title={formatText(slug)}
        breadcrumbs={[{ url: { slug }, name: formatText(slug) }]}
      />
      <div className="mx-auto w-full">
        <div className="sectionPaddingX">
          <div className="sectionPaddingX bg-white pt-6 sm:pt-10 2xl:pt-14">
            <StaticPage slug={slug} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicStaticPage;

const getSEO = (slug) => {
  return get(`/static-pages/seo/${slug}`).then((response) => response?.payload);
};

export const generateMetadata = async ({ params: { slug } }) => {
  const data = await getSEO(slug);

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
          url: data?.social?.share_image ?? "",
          width: 800,
          height: 600,
          alt: "Crkveni Magacin",
        },
      ],
      locale: "sr_RS",
    },
  };
};
