"use client";
import { useCategory } from "@/hooks/ecommerce.hooks";
import { generateBreadcrumbSchema } from "@/_functions";
import BreadcrumbsStatic from "../../../components/BreadcrumbsStatic/BreadcrumbsStatic";

export const SingleCategory = ({ slug, path, base_url, text = "" }) => {
  const { data: singleCategory } = useCategory({ slug });

  const breadcrumbs_schema = generateBreadcrumbSchema({
    parents: singleCategory?.parents,
    path,
    base_url,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs_schema) }}
      />
      <BreadcrumbsStatic
        breadcrumbs={[
          ...(singleCategory?.parents?.map((parent) => ({
            name: parent?.name,
            url: `${parent?.slug_path}`,
          })) ?? []),
          {
            name: singleCategory?.basic_data?.name,
            url: `${singleCategory?.slug_path}`,
          },
        ]}
      />
      <div className="sectionPaddingX">
        <div className="sectionPaddingX bg-white pb-10 pt-10 2xl:pt-[55px]">
          <div className="text-lg text-gold lg:text-[20px]">
            Crkveni Magacin
          </div>
          <h2 className="titleH2 text-left">
            {singleCategory?.basic_data?.name ?? text ?? ""}
          </h2>
          {singleCategory?.basic_data?.short_description && (
            <p
              className="max-w-ful mt-8 w-full text-[15px] 2xl:w-2/3"
              dangerouslySetInnerHTML={{
                __html: singleCategory?.basic_data?.short_description,
              }}
            ></p>
          )}

          {singleCategory?.basic_data?.description && (
            <p
              className="max-w-ful mt-8 w-full text-[15px] 2xl:w-2/3"
              dangerouslySetInnerHTML={{
                __html: singleCategory?.basic_data?.description,
              }}
            ></p>
          )}
        </div>
      </div>
    </>
  );
};
