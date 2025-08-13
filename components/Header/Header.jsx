"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import HeaderIcons from "./HeaderIcons";
import SearchProducts from "./SearchProducts";
import { usePathname } from "next/navigation";
import { useCategoryTree } from "@/hooks/ecommerce.hooks";

const Header = () => {
  const { data: categories } = useCategoryTree();

  const categoriesMain = [
    ...(categories ? categories.slice(0, 1) : []),
    { name: "Početna", slug: "/", isCategory: false, id: 0 },
    {
      name: "Na popustu",
      slug: "/na-popustu",
      isCategory: false,
    },
    {
      name: "Blog",
      slug: "/vesti",
      isCategory: false,
    },
    {
      name: "Kontakt",
      slug: "/kontakt",
      isCategory: false,
    },
  ];

  const [activeCategory, setActiveCategory] = useState({
    open: false,
    id: null,
    name: null,
    slug: null,
    data: [],
    image: null,
  });

  const resetActiveCategory = () => {
    setActiveCategory({
      open: false,
      id: null,
      name: null,
      slug: null,
      data: [],
      image: null,
    });
  };

  const pathname = usePathname();

  return (
    <>
      <HeaderTop />
      <header
        className={`sticky top-0 z-[100] mx-auto w-full bg-primary transition-all duration-300 max-xl:hidden`}
        id="header"
      >
        <div className="sectionPaddingX flex h-20 items-center justify-between gap-5 transition-all duration-300">
          <div className="flex items-center gap-10">
            <Link href="/">
              <Image
                src="/images/logo/logo.png"
                width={147}
                height={64}
                className="min-w-[100px] object-cover"
                alt="logo"
              />
            </Link>
            <div className={`flex h-20 items-end gap-5`}>
              {categoriesMain?.map((category, index) => {
                const isCategory = category?.isCategory ?? true;
                return isCategory ? (
                  category?.children ? (
                    <Link
                      href={`/${category?.link?.link_path}`}
                      key={index}
                      className={`group relative block flex w-fit items-center rounded-t-[15px] px-4 pb-8 pt-4 text-[14px] text-black transition-all duration-300 ${
                        (category?.id === activeCategory?.id &&
                          activeCategory.open) ||
                        pathname.includes(category?.slug)
                          ? "!text-black"
                          : "font-normal !text-black"
                      } ${
                        (activeCategory?.id === category?.id &&
                          activeCategory?.open) ||
                        activeCategory?.open
                          ? "bg-transparent !text-white"
                          : ""
                      } `}
                      onMouseEnter={() => {
                        setActiveCategory({
                          id:
                            category?.id === activeCategory?.id
                              ? null
                              : category?.id,
                          name:
                            category?.name === activeCategory?.name
                              ? null
                              : category?.name,
                          slug:
                            category?.slug === activeCategory?.slug
                              ? null
                              : category?.slug,
                          data: category?.children ?? [],
                          image: category?.image ?? null,
                          open: true,
                        });
                      }}
                      onClick={resetActiveCategory}
                    >
                      <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden bg-transparent">
                        <div
                          className={`absolute left-0 top-0 bg-gold ${
                            (category?.id === activeCategory?.id &&
                              activeCategory.open) ||
                            activeCategory?.open
                              ? "shrink"
                              : "expand"
                          } `}
                          style={{ height: "100%" }}
                        ></div>
                      </div>
                      {category?.icon && (
                        <Image
                          src={category?.icon}
                          alt={category?.name}
                          width={20}
                          height={20}
                          className={`mr-2 h-5 w-5 transition-all duration-300 group-hover:invert ${
                            (category?.id === activeCategory?.id &&
                              activeCategory.open) ||
                            activeCategory?.open
                              ? "invert"
                              : ""
                          }`}
                        />
                      )}
                      {category?.name}
                    </Link>
                  ) : (
                    <Link
                      href={`/${category?.link?.link_path}`}
                      key={index}
                      onClick={() => resetActiveCategory()}
                    >
                      <span
                        className={`activeCategoryHover relative block w-fit pb-8 pt-4 text-[14px] font-semibold text-white ${
                          pathname?.includes(category?.slug) &&
                          category?.id !== 0
                            ? "activeCategory"
                            : ""
                        }`}
                      >
                        {category?.name}
                      </span>
                    </Link>
                  )
                ) : (
                  <Link
                    href={`${category?.slug}`}
                    key={index}
                    onClick={resetActiveCategory}
                  >
                    <span
                      className={`activeCategoryHover relative block w-fit pb-8 pt-4 text-[14px] text-white ${
                        pathname?.includes(category?.slug) && category?.id !== 0
                          ? "activeCategory"
                          : pathname === category?.slug && category?.id === 0
                            ? "activeCategory"
                            : ""
                      }`}
                    >
                      {category?.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <SearchProducts />
            <HeaderIcons />
          </div>
        </div>
        {activeCategory?.open && (
          <div
            onMouseLeave={resetActiveCategory}
            className={`absolute right-0 z-[100] w-full bg-white transition-all duration-300 max-lg:hidden`}
          >
            <div className="relative h-full px-20 pb-14 pt-8">
              <div className="grid gap-8 xl:grid-cols-4 2xl:grid-cols-5">
                {activeCategory?.data?.map((category, index) => (
                  <div key={index} className="flex flex-col">
                    <h3 className="text-xl font-bold text-primary">
                      {category?.name}
                    </h3>
                    <div className="mt-4 flex flex-col gap-2">
                      {category?.children?.map((subcategory, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subcategory?.slug_path}
                          className="text-base text-black hover:text-gold"
                          onClick={resetActiveCategory}
                        >
                          {subcategory?.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mb-2.5 mt-4 h-[1px] w-[100px] bg-gold" />
                    <Link
                      href={category?.slug_path}
                      className="group relative flex items-center text-base text-black hover:text-gold"
                      onClick={resetActiveCategory}
                    >
                      Pogledajte sve{" "}
                      <Image
                        src="/icons/right-chevron.png"
                        alt="Chevron"
                        width={16}
                        height={16}
                        className="goldFilter ml-1 mt-0.5 h-3 w-3"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      {activeCategory?.open && (
        <div
          onClick={() => {
            setActiveCategory({
              open: false,
              id: null,
              name: null,
              slug: null,
              data: [],
              image: null,
            });
          }}
          className="fixed left-0 top-10 z-[99] h-screen w-screen bg-black/50 backdrop-blur-md transition-all duration-500"
        />
      )}
      {/* Spacer to prevent content jump when header becomes fixed */}
      <div className={`transition-all duration-300 max-xl:hidden`}></div>
    </>
  );
};

export default Header;
