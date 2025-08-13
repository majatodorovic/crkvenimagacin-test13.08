import { headers } from "next/headers";

// Metadata koja koristi samo headers
export const generateMetadata = async () => {
  const header_list = headers();
  const canonical = header_list?.get("x-pathname");

  return {
    title: `Korpa | Crkveni Magacin`,
    description: "Dobrodošli na Crkveni Magacin",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Korpa | Crkveni Magacin`,
      description: "Dobrodošli na Crkveni Magacin",
      type: "website",
      locale: "sr_RS",
    },
  };
};

// Glavni layout komponent
export default async function CartLayout({ children }) {
  return <div className="mx-auto min-h-screen">{children}</div>;
}

export const revalidate = 30;
