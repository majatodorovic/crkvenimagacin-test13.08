"use client";
import Filter from "./Filter";
import { sortKeys } from "@/helpers/const";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const Filters = ({
  availableFilters,
  selectedFilters,
  setSelectedFilters,
  setSort,
  pagination,
  setTempSelectedFilters,
  setLastSelectedFilterKey,
  setChangeFilters,
  setPage,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [openSort, setOpenSort] = useState({
    open: false,
    key: {
      field: "",
      direction: "",
    },
  });
  const filterRef = useRef(null);

  const handleClickInsideAndOutside = (e) => {
    // Close the filter if the click occurred outside of it or if the user clicked on the filter

    if (
      (!filterRef?.current?.contains(e.target) ||
        e.target?.classList?.contains("filter")) &&
      openIndex !== null
    ) {
      setOpenIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickInsideAndOutside);
    return () => {
      document.removeEventListener("click", handleClickInsideAndOutside);
    };
  }, [openIndex]);

  const sortRef = useRef(null);

  const handleClickInsideAndOutsideSort = (e) => {
    if (
      (!sortRef?.current?.contains(e.target) ||
        e.target?.classList?.contains("sortref")) &&
      openSort !== false
    ) {
      setOpenSort({
        ...openSort,
        open: false,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickInsideAndOutsideSort);
    return () => {
      document.removeEventListener("click", handleClickInsideAndOutsideSort);
    };
  }, [openSort]);

  const params = useSearchParams();
  const sortParam = params?.get("sort") ?? "_";

  const keys = sortParam?.split("_");

  useEffect(() => {
    if (sortParam && keys[0] && keys[1]) {
      setSort({
        field: keys[0],
        direction: keys[1],
      });
      setOpenSort({
        open: false,
        key: {
          field: keys[0],
          direction: keys[1],
        },
      });
    }
  }, [sortParam]);
  return (
    <>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-5`}>
          <div className="text-xl">Filteri:</div>{" "}
          {(availableFilters ?? []).map((filter, index) => {
            const isOpen = openIndex === index;
            if (filter.column === "id_category") {
              return null;
            }
            return (
              <div
                key={`${index}-filters`}
                className="relative gap-5 filter max-lg:hidden"
              >
                <div
                  className="relative cursor-pointer select-none filter"
                  key={filter?.id}
                  onClick={() => {
                    setOpenIndex(openIndex === index ? null : index);
                  }}
                >
                  <div
                    className={`relative flex min-w-[150px] items-center justify-between gap-2 rounded-full border border-[#D9D9D9] px-3 py-1.5 ${isOpen && "rounded-b-none rounded-t-[24px]"}`}
                  >
                    <div className="text-left text-lg font-light">
                      {filter?.name}
                    </div>
                    <Image
                      className={`h-auto w-3 invert ${
                        isOpen
                          ? `-rotate-90 transition-all duration-500`
                          : `rotate-90 transition-all duration-500`
                      }`}
                      src={`/icons/chevron-right.png`}
                      alt={`TFY Production`}
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
                {isOpen && (
                  <div
                    ref={filterRef}
                    className={`z-[20] ${
                      filter?.name === "Cena" && "w-[230px]"
                    } absolute left-0 top-[42px] w-[150px] rounded-b-lg border-b border-l border-r border-[#f2f2f2] bg-white`}
                  >
                    <div className="pb-3.5 filter">
                      <Filter
                        filter={filter}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        setTempSelectedFilters={setTempSelectedFilters}
                        setLastSelectedFilterKey={setLastSelectedFilterKey}
                        setChangeFilters={setChangeFilters}
                        setPage={setPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {selectedFilters?.length > 0 && (
          <div
            className="relative ml-5 mr-auto cursor-pointer select-none"
            onClick={() => {
              setSelectedFilters([]);
              setChangeFilters(true);
              setOpenIndex(null);
            }}
          >
            <div className={`relative flex items-center gap-2`}>
              <h1 className="text-center text-base">Izbrišite sve</h1>
              <i className="fa-solid fa-times mr-2 text-lg"></i>
            </div>
          </div>
        )}
        <div className={`flex items-center gap-7`}>
          <div className="relative col-span-1 col-start-7 flex items-center justify-end">
            <h1 className="text-center text-xl font-light">
              {pagination?.total_items} Proizvoda
            </h1>
          </div>
          <div className="h-5 w-[1px] bg-black" />
          <div className="relative col-span-1 col-start-8 flex items-center justify-end gap-2.5">
            <h1 className="text-center text-xl">Sortiranje po:</h1>
            <div
              className={`flex w-[250px] cursor-pointer items-center justify-between gap-2 rounded-full border px-3 py-1.5 ${openSort.open && "rounded-b-none rounded-t-[24px]"}`}
              onClick={() =>
                setOpenSort({
                  ...openSort,
                  open: !openSort.open,
                })
              }
            >
              <div className="max-w-[200px] truncate text-center text-lg font-light">
                {openSort?.key?.field && openSort?.key?.direction
                  ? sortKeys.find(
                      (key) =>
                        key.field === openSort.key.field &&
                        key.direction === openSort.key.direction,
                    )?.label || "Sortiranje"
                  : "Sortiranje"}
              </div>
              <Image
                className={`h-auto w-4 invert ${
                  openSort.open
                    ? `-rotate-90 transition-all duration-500`
                    : `rotate-90 transition-all duration-500`
                }`}
                src={`/icons/chevron-right.png`}
                alt={`TFY Production`}
                width={15}
                height={15}
              />
            </div>
            {openSort?.open && (
              <div
                ref={sortRef}
                className="sortref absolute top-[42px] z-[2] flex w-[250px] flex-col items-center justify-end overflow-hidden rounded-b-lg border border-[#D9D9D9] bg-white"
              >
                {sortKeys.map((key, index) => {
                  const isActive =
                    openSort?.key?.field === key?.field &&
                    openSort?.key?.direction === key?.direction;
                  return (
                    <div
                      key={`${index}-sortKey`}
                      className={`sortref flex w-full cursor-pointer items-center justify-start px-4 py-2 text-black ${
                        isActive ? "" : "bg-white"
                      }`}
                      onClick={() => {
                        setSort({
                          field: key?.field,
                          direction: key?.direction,
                        });
                        setOpenSort({
                          open: false,
                          key: {
                            field: key?.field,
                            direction: key?.direction,
                          },
                        });
                      }}
                    >
                      <h1
                        className={`sortref ${
                          isActive ? `text-black` : ``
                        } text-center text-base font-light hover:text-black`}
                        onClick={() =>
                          setOpenSort({
                            open: false,
                            key: {
                              field: key?.field,
                              direction: key?.direction,
                            },
                          })
                        }
                      >
                        {key?.label}
                      </h1>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;
