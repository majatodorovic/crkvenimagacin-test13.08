"use client";

import Image from "next/image";

const items = [
  {
    title: "Dostava u Srbiji",
    description: "Cena za pakete do 5kg iznosi samo 399 din.",
    icon: "benefit-1.svg",
  },
  {
    title: "Dostava u inostranstvu",
    description: "U roku od 5 radnih dana u bilo koji kraj sveta.",
    icon: "benefit-2.svg",
  },
  {
    title: "Vraćamo novac",
    description: "Ukoliko niste zadovoljni sa proizvodom.",
    icon: "benefit-3.svg",
  },
  {
    title: "Imate pitanja?",
    description: "Kontaktirajte nas putem emaila ili telefona.",
    icon: "benefit-4.svg",
  },
];

const Benefits = () => {
  return (
    <div className="sectionPaddingX marginBottomSection" data-aos="fade-up">
      <div className="grid gap-5 max-xl:gap-8 md:grid-cols-2 2xl:grid-cols-4 3xl:gap-8">
        {items.map((item) => (
          <div key={item.title} className="group flex items-center gap-4">
            <div className="group-hover:bg-gold relative flex min-h-[90px] min-w-[90px] items-center justify-center rounded-full bg-[#F0F0F0] transition-all duration-300">
              <Image
                src={`/icons/benefits/${item.icon}`}
                alt={item.title}
                width={55}
                height={55}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-start justify-between">
              <h3 className="text-[20px] font-semibold leading-[normal] text-[#141414]">
                {item.title}
              </h3>
              <div className="group-hover:bg-gold mb-0.5 mt-2 h-[1px] w-[86px] bg-white" />
              <p className="transform text-[15px] text-[#565656]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
