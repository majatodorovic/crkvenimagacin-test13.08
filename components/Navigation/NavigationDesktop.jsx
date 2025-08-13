"use client";
import Image from "next/image";
import { useCartContext } from "@/api/cartContext";
import { useState, useCallback, useEffect, useRef } from "react";
import { get, list } from "@/api/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoDark from "../../assets/Logo/Croonus-logo-dark.png";
import LogoLight from "../../assets/Logo/Croonus-logo-light.png";
import { currencyFormat } from "@/helpers/functions";

const NavigationDesktop = () => {
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cart, , wishList] = useCartContext();
  const [wishListCount, setWishListCount] = useState(0);
  let category = false;
  if (pathname === "/") {
    category = false;
  } else {
    category = true;
  }
  useEffect(() => {
    const getCategories = async () => {
      await get("/categories/product/tree").then((response) =>
        setCategories(response?.payload),
      );
    };
    getCategories();
  }, []);

  const getCartCount = useCallback(() => {
    get("/cart/badge-count")
      .then((response) => {
        setCartCount(response?.payload?.summary?.items_count ?? 0);
      })
      .catch((error) => console.warn(error));
  }, []);

  const getWishlistCount = useCallback(() => {
    get("/wishlist/badge-count")
      .then((response) => {
        setWishListCount(response?.payload?.summary?.items_count ?? 0);
      })
      .catch((error) => console.warn(error));
  }, []);

  useEffect(() => {
    getWishlistCount();
  }, [getWishlistCount, wishList, wishListCount]);

  useEffect(() => {
    getCartCount();
  }, [getCartCount, cart, cartCount]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?search=${searchTerm}`);
    setSearchTerm("");
  };
  const [isActive, setIsActive] = useState(categories[0]?.id ?? null);
  const [activeCategory, setActiveCategory] = useState();

  useEffect(() => {
    const category = categories.filter((category) => category?.id === isActive);
    setIsActive(category[0]?.id);
  }, [isActive]);

  const [open, setOpen] = useState(false);
  const [isActiveSubcategory, setIsActiveSubcategory] = useState({
    id: undefined,
    slug: undefined,
  });
  const [activeSubSubCategory, setActiveSubSubCategory] = useState();
  const [background, setBackground] = useState("transparent");

  useEffect(() => {
    if (category) {
      setBackground("white");
    }

    function handleScroll() {
      if (category) {
        setBackground("white");
      } else {
        if (window.scrollY > 0 && !category) {
          setBackground("white");
        } else {
          setBackground("transparent");
        }
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [category, background]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setVisible((scrollY === 0 && pathname === "/") || (open && scrollY > 0));
      pathname?.includes("/kategorija") && setVisible(false) && setOpen(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open, pathname]);

  useEffect(() => {
    setVisible(true);
  }, [open]);

  useEffect(() => {
    if (categories) {
      setIsActive(categories[0]?.id);
      setActiveCategory(categories[0]);
    }
  }, [categories]);
  const router = useRouter();
  useEffect(() => {
    if (pathname?.includes("/korpa/")) {
      getCartCount();
      router?.refresh();
    }
  }, [pathname]);

  useEffect(() => {
    const handleMouseOutsideOfBrowserViewport = (event) => {
      if (event.clientY <= 0) {
        setOpen(false);
      }
    };

    window.addEventListener("mousemove", handleMouseOutsideOfBrowserViewport);
    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseOutsideOfBrowserViewport,
      );
    };
  }, []);

  useEffect(() => {
    if (pathname?.includes("/kategorija")) {
      setOpen(false);
      setVisible(false);
    }
  }, [pathname]);

  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (searchTerm?.length > 0) {
      const getData = async (search) => {
        await list(`/products/search/list`, {
          search: search,
        }).then((response) => {
          setSearchData(response?.payload);
          setLoading(false);
        });
      };
      getData(searchTerm);
    }
  }, [searchTerm]);

  const searchRef = useRef(null);
  const searchImgRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !searchImgRef.current.contains(event.target)
      ) {
        setSearchTerm("");
        setSearchData([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const [landingPagesList, setLandingPagesList] = useState([]);

  useEffect(() => {
    const getLandingPages = async () => {
      await list(`/landing-pages/list`).then((response) =>
        setLandingPagesList(response?.payload),
      );
    };
    getLandingPages();
  }, []);
  return (
    <>
      <div
        className={`sticky top-0 z-[54] flex w-full items-center justify-between max-lg:hidden bg-${
          category ? `white` : `${background}`
        } ${background === "white" ? `bg-opacity-70 backdrop-blur` : ``}`}
        id="navigation"
      >
        <div
          className={`absolute top-0 h-[4.719rem] ${
            background === "white" ? `bg-opacity-90 backdrop-blur` : `pt-8`
          } z-[54] flex w-full items-center justify-between px-[3%] bg-${
            category ? `white` : `${background}`
          } transition-all duration-500`}
        >
          <div
            className="flex items-center gap-20"
            // onMouseEnter={() => {
            //   if (background === "white") {
            //     setOpen(true);
            //   }
            // }}
          >
            <Link href="/">
              {open || background === "white" ? (
                <Image
                  onClick={() => {
                    setOpen(false);
                    setVisible(false);
                  }}
                  src={LogoDark}
                  width={110}
                  height={110}
                  alt=""
                />
              ) : (
                <Image
                  onClick={() => {
                    setOpen(false);
                    setVisible(false);
                  }}
                  src={LogoLight}
                  width={110}
                  height={110}
                  alt=""
                />
              )}
            </Link>
            <div
              className="flex flex-row items-center gap-5"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              {categories?.map((category, index) => {
                const isActiveCategory = isActive === category?.id;

                return (
                  <div
                    onClick={() => {
                      setOpen(true);
                    }}
                    key={index}
                    className={`uppercase ${
                      (isActiveCategory && !open && background === "transparent"
                        ? `text-white`
                        : isActiveCategory && !open && background === "white"
                          ? `text-black`
                          : !isActiveCategory &&
                            !open &&
                            background === "transparent" &&
                            `text-white`) ||
                      ((open &&
                        isActiveCategory &&
                        background === "transparent") ||
                      (open && isActiveCategory && background === "white")
                        ? `bg-black text-white`
                        : `text-black`) ||
                      (open && isActiveCategory && background === "white"
                        ? `bg-red-500 text-white`
                        : `bg-red-500 text-white`)
                    } cursor-pointer rounded px-5 py-1 text-[0.8rem]`}
                    onMouseEnter={() => {
                      setIsActive(category?.id);
                      setActiveCategory(category);
                      setActiveSubSubCategory();
                    }}
                  >
                    {category?.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="relative flex items-center gap-5">
              <Image
                ref={searchImgRef}
                src={"/icons/search.png"}
                width={20}
                height={20}
                alt=""
                onClick={handleSearch}
                className={
                  background === "white"
                    ? "cursor-pointer"
                    : "cursor-pointer invert"
                }
              />
              <form
                onSubmit={handleSearch}
                className={`${
                  searchTerm?.length > 0 ? `w-[25rem]` : `w-60`
                } relative transition-all duration-500`}
              >
                <input
                  type="text"
                  placeholder="PRETRAGA"
                  className={`w-full border-b border-l-0 border-r-0 border-t-0 bg-transparent ${
                    background === "white"
                      ? "border-b-black text-black"
                      : "border-b-white text-white placeholder:text-white focus:border-b-white"
                  } p-0 text-sm placeholder:text-sm focus:border-b-black focus:outline-none focus:ring-0`}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setLoading(true);
                  }}
                  value={searchTerm}
                />
                <div
                  ref={searchRef}
                  className={`${
                    searchTerm?.length > 0
                      ? `hidescrollbar absolute right-0 top-[30px] flex h-[420px] w-full flex-col overflow-y-auto rounded-b-lg border bg-white`
                      : `hidden`
                  } `}
                >
                  {searchData?.items?.length > 0 && searchTerm?.length > 0 && (
                    <div className="mx-auto mt-5 w-[95%]">
                      <h1 className="text-[1rem] font-normal">
                        Rezultati pretrage
                      </h1>
                      <div className="mt-3 flex flex-col gap-5 pb-5">
                        {searchData?.items?.slice(0, 6)?.map((item, index) => {
                          return (
                            <Link
                              key={index}
                              href={`/${item?.link?.link_path}`}
                              onClick={(e) => {
                                setSearchData([]);
                                handleSearch(e);
                                setSearchTerm("");
                              }}
                            >
                              <div className="flex flex-row items-center gap-5">
                                <div className="relative h-[60px] w-[60px]">
                                  <Image
                                    src={item.image[0]}
                                    alt={``}
                                    fill
                                    sizes="100vw"
                                    className={`rounded-full object-cover`}
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <h1 className="text-[0.9rem] font-normal">
                                    {item?.basic_data?.name}
                                  </h1>
                                  <h1 className="w-fit bg-[#f8ce5d] px-2 text-center text-[0.9rem] font-bold">
                                    {currencyFormat(
                                      item?.price?.price?.discount ??
                                        item?.price?.price?.original,
                                      item?.price?.currency,
                                    )}
                                  </h1>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {loading && (
                    <div className={`mx-auto mt-5 w-[95%] text-center`}>
                      <i
                        className={`fas fa-spinner fa-spin text-xl text-black`}
                      ></i>
                    </div>
                  )}
                  {!loading && (
                    <div
                      className={`sticky bottom-0 mt-auto w-full bg-croonus-2 py-2 text-center hover:bg-opacity-80`}
                    >
                      <button
                        onClick={() => {
                          handleSearch();
                          setSearchData([]);
                        }}
                        className={`h-full w-full text-center font-light text-white`}
                      >
                        Prikaži sve rezultate (
                        {searchData?.pagination?.total_items > 10
                          ? `još ${searchData?.pagination?.total_items - 10}`
                          : `Pretraži`}
                        )
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/login">
                <Image
                  src={"/icons/user.png"}
                  width={40}
                  height={40}
                  alt=""
                  className={
                    background === "white" ? "wiggle" : "wiggle invert"
                  }
                />
              </Link>
              <Link href="/lista-zelja">
                {" "}
                <div className="relative">
                  <Image
                    src={"/icons/heart.svg"}
                    width={30}
                    height={30}
                    alt=""
                    className={`h-auto w-7 ${background === "white" ? "wiggle" : "wiggle invert"} `}
                  />
                  <span className="absolute -right-1 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#e10000] text-xs text-white">
                    {wishListCount}
                  </span>
                </div>
              </Link>
              <Link href="/korpa">
                <div className="relative">
                  <Image
                    src={"/icons/shopping-bag.png"}
                    width={40}
                    height={40}
                    alt=""
                    className={`${
                      background === "white" ? "wiggle" : "wiggle invert"
                    } h-auto w-10`}
                  />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e10000] text-xs text-white">
                    {cartCount}
                  </span>
                </div>
              </Link>
            </div>
            !
          </div>
        </div>
      </div>
      <div
        className={
          open
            ? `fixed left-0 top-0 z-[54] flex h-full flex-col px-[3%] transition-all duration-500 max-md:hidden lg:min-w-[480px] 4xl:min-w-[500px] ${
                background === "white"
                  ? `py-4 transition-all duration-500`
                  : `pt-8 transition-all duration-500`
              } gap-[162px] bg-white transition-all duration-500`
            : `fixed -translate-x-[150%] transition-all duration-500 max-md:hidden ${
                background === "white"
                  ? `invisible transition-all duration-500`
                  : `transition-all duration-500`
              } left-0 top-0 z-[54] flex h-full flex-col px-[3%] transition-all duration-500 lg:min-w-[480px] 4xl:min-w-[500px] ${
                background === "white"
                  ? `py-4 transition-all duration-500`
                  : `pt-8 transition-all duration-500`
              } gap-[162px] bg-transparent transition-all duration-500`
        }
        onMouseEnter={() => {
          if (background === "white" && category) {
            setOpen(true);
          } else {
            setOpen(true);
          }
        }}
        onMouseLeave={() => {
          for (let i = 0; i < 100; i++) {
            clearTimeout(i);
          }
          setOpen(false);
        }}
      >
        <div
          className={`bg-${background} sticky top-5 flex w-full items-center gap-20`}
        >
          <Link href={`/`}>
            <Image
              onClick={() => {
                setOpen(false);
                setVisible(false);
              }}
              src={LogoDark}
              width={110}
              height={110}
              alt=""
            />
          </Link>
          <div className="flex flex-row gap-5">
            {categories?.map((item, index) => {
              return (
                <div
                  key={index}
                  onMouseEnter={() => {
                    setIsActive(item?.id);
                    setActiveCategory(item);
                    setActiveSubSubCategory();
                  }}
                >
                  <Link
                    href={`/${item?.link?.link_path}`}
                    className="cursor-pointer rounded px-5 py-1 text-[0.8rem] font-medium uppercase transition-all duration-300 hover:translate-x-5 hover:bg-black hover:text-slate-500 hover:text-white"
                  >
                    {item?.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={
            visible
              ? `sticky top-[100px] translate-x-0 transition-all duration-[700ms]`
              : `-translate-x-full transition-all duration-[900ms]`
          }
        >
          <div
            className={
              open
                ? `flex flex-row gap-10 text-black transition-all duration-500`
                : `flex flex-row gap-10 text-white transition-all duration-500`
            }
          >
            <div className="flex h-full min-w-[230px] flex-col gap-10">
              <div className="flex flex-col gap-1 mix-blend-difference">
                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  href="/novo"
                  className="text-lg font-medium uppercase transition-all duration-300 hover:translate-x-5 hover:text-slate-500"
                >
                  Novo
                </Link>
                {landingPagesList?.items?.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      onClick={() => {
                        setOpen(false);
                      }}
                      href={`/promo/${item?.slug}`}
                      className="text-lg font-medium uppercase text-red-500 transition-all duration-300 hover:translate-x-5 hover:text-slate-500"
                    >
                      {item?.name}
                    </Link>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1 mix-blend-difference">
                {activeCategory?.children?.map((category, index) => {
                  const isActiveCategory =
                    isActiveSubcategory.id === category?.id;
                  return (
                    <div
                      key={index}
                      className={
                        isActiveCategory
                          ? `relative flex cursor-pointer items-center gap-4 text-lg font-medium uppercase transition-all duration-300 hover:translate-x-5 hover:text-slate-500`
                          : `cursor-pointer text-lg font-medium uppercase transition-all duration-300 hover:translate-x-5 hover:text-slate-500`
                      }
                    >
                      {category?.children?.length > 0 ? (
                        <h1
                          onClick={() => {
                            setIsActiveSubcategory({
                              id: category?.id,
                              slug: category?.slug,
                            });
                            setActiveSubSubCategory(category?.children);
                          }}
                        >
                          {category?.name}
                        </h1>
                      ) : (
                        <Link
                          href={`/${category?.link?.link_path}`}
                          onClick={() => {
                            setOpen(false);
                            setVisible(false);
                            setBackground("white");
                          }}
                        >
                          {category?.name}
                        </Link>
                      )}

                      <div
                        className={
                          isActiveCategory && open && activeSubSubCategory
                            ? `line relative`
                            : `hidden`
                        }
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  className="text-lg font-medium uppercase transition-all duration-300 hover:translate-x-5 hover:text-slate-500"
                >
                  Outlet
                </Link>
              </div>
            </div>
            <div
              className={
                open
                  ? `flex h-[550px] w-[150px] flex-col gap-2 overflow-y-auto overflow-x-hidden opacity-100 transition-all duration-500`
                  : `invisible flex flex-col gap-2 opacity-0 transition-all duration-500`
              }
            >
              {activeSubSubCategory?.map((category, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      pathname?.includes(category?.slug)
                        ? `text-[#e10000]`
                        : `text-black`
                    } text-xs font-medium transition-all duration-300 hover:translate-x-2 hover:text-slate-500`}
                  >
                    <Link
                      href={`/${category?.link?.link_path}`}
                      onClick={() => {
                        setOpen(false);
                        setVisible(false);
                        setBackground("white");
                      }}
                    >
                      {category?.name}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationDesktop;
