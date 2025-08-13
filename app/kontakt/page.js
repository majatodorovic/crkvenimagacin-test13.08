import Contact from "@/app/kontakt/components/Contact";
import { headers } from "next/headers";
import BreadcrumbsStatic from "@/components/BreadcrumbsStatic/BreadcrumbsStatic";

const Kontakt = async ({ searchParams }) => {
  const { proizvodIme, proizvodId, atribut } = searchParams;

  const defaultMessage =
    proizvodIme && proizvodId
      ? `Poštovani, \n\nMolim Vas da na datu e-mail adresu pošaljete ponudu za proizvod ${proizvodIme} - ${proizvodId}. ${
          atribut ? atribut : ""
        }.\n\nHvala.`
      : null;

  return (
    <>
      <BreadcrumbsStatic title="Kontakt" breadcrumbs={[{ name: "Kontakt" }]} />
      <section className="sectionPaddingX">
        <Contact defaultMessage={defaultMessage} />
      </section>
    </>
  );
};

export default Kontakt;

export const generateMetadata = async () => {
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: `Kontakt | Crkveni Magacin`,
    description: "Dobrodošli na Crkveni Magacin",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Kontakt | Crkveni Magacin`,
      description: "Dobrodošli na Crkveni Magacin",
      type: "website",
      images: [
        {
          url: "https://www.ankersrbija.rs/images/logo/logo.png",
          width: 800,
          height: 600,
          alt: "Crkveni Magacin",
        },
      ],
      locale: "sr_RS",
    },
  };
};
