import Image from "next/image";
import React from "react";

function HeaderTop() {
  return (
    <div className="mx-auto w-full bg-lightGray">
      <div className="sectionPaddingX flex h-10 w-full items-center justify-between">
        <div className="text-xs font-normal text-black">
          Besplatna isporuka za iznos porudžbine preko 12.000 RSD
        </div>
        <div className="flex items-center gap-5 text-xs text-black">
          <a
            href={`tel:${process.env.TELEPHONE}`}
            className="group flex items-center gap-5"
          >
            <Image
              src="/icons/telephone.svg"
              alt="telephone"
              width={16}
              height={16}
            />
            <span className="group-hover:text-gold">
              {process.env.TELEPHONE}
            </span>
          </a>
          <div className="h-10 w-[1px] bg-[#EAEAEA]"></div>
          {process?.env?.STREET_ADDRESS && (
            <div className="group flex items-center gap-2">
              <Image
                src="/icons/location.svg"
                alt="location"
                width={12}
                height={12}
              />
              <span className="group-hover:text-gold">
                {process.env.STREET_ADDRESS}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderTop;
