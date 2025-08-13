import { get, get as GET } from "@/api/api";
import SinglePost from "@/app/vesti/[slug]/components/SinglePost";
import { headers } from "next/headers";
import BreadcrumbsStatic from "@/components/BreadcrumbsStatic/BreadcrumbsStatic";

const getBlogPost = async (slug) => {
  return await GET(`/news/details/${slug}`).then((res) => res?.payload);
};

const BlogPostDetails = async ({ params: { slug } }) => {
  const post = await getBlogPost(slug);
  return (
    <>
      <BreadcrumbsStatic
        breadcrumbs={[
          { name: "Vesti", url: "/vesti" },
          { name: post?.basic_data?.title, url: `/vesti/${slug}` },
        ]}
        title={post?.basic_data?.title}
      />
      <SinglePost post={post} />
    </>
  );
};

export default BlogPostDetails;

const getSEO = (slug) => {
  return get(`/news/details/seo/${slug}`).then((response) => response?.payload);
};

export const generateMetadata = async ({ params: { slug } }) => {
  const data = await getSEO(slug);
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: data?.meta_title ?? "Vesti | Crkveni Magacin",
    description: data?.meta_description ?? "Dobrodošli na Crkveni Magacin",
    alternates: {
      canonical: data?.meta_canonical_link ?? canonical,
    },
    robots: {
      index: data?.meta_robots?.index ?? true,
      follow: data?.meta_robots?.follow ?? true,
    },
    openGraph: {
      title: data?.social?.share_title ?? "Vesti | Crkveni Magacin",
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
