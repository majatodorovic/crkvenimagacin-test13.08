"use client";
import Image from "next/image";
import Link from "next/link";
import Newsletter from "../Newsletter/Newsletter";

const Footer = () => {
  return (
    <div className="mx-auto mt-20 w-full bg-primary pt-9 text-white lg:mt-[100px]">
      <div className="sectionPaddingX">
        <div className="flex items-center justify-between border-b border-l-0 border-r-0 border-t-0 border-b-primary pb-4 max-xl:flex-col max-sm:items-start">
          <Link href={`/`}>
            <Image
              src={"/images/logo/logo.png"}
              width={275}
              height={100}
              alt="Croonus Logo"
            />
          </Link>

          <div className="flex flex-wrap items-center gap-1 max-xl:mt-10">
            <a>Facebook</a>
            <div className="mx-2 h-3 w-[1px] bg-gold"></div>
            <a>Instagram</a>
            <div className="mx-2 h-3 w-[1px] bg-gold"></div>
            <a>Youtube</a>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gold"></div>
        <div className="flex justify-between gap-10 pt-8 max-xl:flex-col 2xl:gap-20">
          <div className="flex w-full flex-col">
            <div className="flex flex-wrap items-center gap-1 text-[15px]">
              <Link
                href={`/strana/uslovi-koriscenja`}
                className="hover:text-gold"
              >
                Uslovi korišćenja
              </Link>
              <div className="mx-2 h-3 w-[1px] bg-gold"></div>

              <Link href={`/strana/reklamacije`} className="hover:text-gold">
                Reklamacije
              </Link>
              <div className="mx-2 h-3 w-[1px] bg-gold"></div>
              <Link
                href={`/strana/pravo-na-odustajanje`}
                className="hover:text-gold"
              >
                Pravo na odustajanje
              </Link>
              <div className="mx-2 h-3 w-[1px] bg-gold"></div>
              <Link
                href={`/strana/opsti-uslovi-poslovanja#politika-reklamacija`}
                className="hover:text-gold"
              >
                Zamena artikala
              </Link>
              <div className="mx-2 h-3 w-[1px] bg-gold"></div>

              <Link href={`/strana/kako-kupiti`} className="hover:text-gold">
                Kako kupiti
              </Link>
              <div className="mx-2 h-3 w-[1px] bg-gold"></div>

              <Link href={`/strana/o-nama`} className="hover:text-gold">
                O nama
              </Link>
              <div className="mx-2 h-3 w-[1px] bg-gold"></div>
              <Link href={`/kontakt`} className="hover:text-gold">
                Kontakt
              </Link>
            </div>
            <p className="my-10 max-w-[680px] text-[13px]">
              Cene na sajtu su iskazane u dinarima sa uračunatim porezom, a
              plaćanje se vrši isključivo u dinarima. Isporuka se vrši SAMO na
              teritoriji Republike Srbije. Nastojimo da budemo što precizniji u
              opisu proizvoda, prikazu slika i samih cena, ali ne možemo
              garantovati da su sve informacije kompletne i bez grešaka. Svi
              artikli prikazani na sajtu su deo naše ponude i ne podrazumeva da
              su dostupni u svakom trenutku. Raspoloživost robe možete proveriti
              pozivanjem Call Centra na{" "}
              <a
                href={`tel:${process.env.TELEPHONE}`}
                className="hover:underline"
              >
                {process.env.TELEPHONE}
              </a>{" "}
              (po ceni lokalnog poziva).
            </p>
          </div>
          <div className="sm:min-w-[360px]">
            <Newsletter />
          </div>
        </div>
        <div className="h-[1px] w-full bg-gold"></div>
        <div className="flex items-center justify-between pb-14 pt-4 max-md:flex-col">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Eparhija Šumadijska | Sva prava
            zadržana. Powered by{" "}
            <a
              href="https://www.croonus.com"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-gold hover:text-white"
            >
              Croonus Technologies
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
