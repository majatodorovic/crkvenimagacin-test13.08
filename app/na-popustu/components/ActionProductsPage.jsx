"use client";
import { Thumb } from "@/components/Thumb/Thumb";
import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import BreadcrumbsStatic from "../../../components/BreadcrumbsStatic/BreadcrumbsStatic";
import { CategoryPagination } from "@/_pages/category/CategoryPagination";
import { useActionProducts } from "@/hooks/ecommerce.hooks";
import { post as POST } from "@/api/api";
import FiltersMobile from "@/app/categories/components/FilterMobile";
import Filters from "@/app/categories/components/Filters";

const ActionProductsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const pageKey = Number(params?.get("strana"));
  const [page, setPage] = useState(pageKey > 0 ? pageKey : 1);

  const parseFilterQuery = (filterString) => {
    if (!filterString) return [];
    return filterString.split("::").map((pair) => {
      const [column, values] = pair.split("=");
      return {
        column,
        value: { selected: values ? values.split("_") : [] },
      };
    });
  };

  const filterStringFromUrl = params.get("filteri");
  const initialFilters = parseFilterQuery(filterStringFromUrl);

  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [changeFilters, setChangeFilters] = useState(false);
  const [tempSelectedFilters, setTempSelectedFilters] = useState([]);
  const [lastSelectedFilterKey, setLastSelectedFilterKey] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const sortParamFromUrl = params.get("sort");
  const sort = (() => {
    if (sortParamFromUrl && sortParamFromUrl.includes("_")) {
      const [field, direction] = sortParamFromUrl.split("_");
      return { field, direction: direction?.toUpperCase() };
    }
    return { field: "", direction: "" };
  })();

  const { data: actionProducts, isLoading } = useActionProducts(
    page,
    12,
    selectedFilters,
    sort.field && sort.direction ? sort : undefined,
  );

  const buildFilterQuery = (selectedFilters) => {
    if (!selectedFilters || selectedFilters.length === 0) return "";
    return selectedFilters
      .map(
        (filter) =>
          `${filter.column}=${(filter.value?.selected || []).join("_")}`,
      )
      .join("::");
  };

  const updateURLQuery = (page, selectedFilters, sort) => {
    const filterString = buildFilterQuery(selectedFilters);
    const sortString =
      sort?.field && sort?.direction
        ? `${sort.field}_${sort.direction.toLowerCase()}`
        : "";

    // Build query string with proper separator logic
    let parts = [];

    if (filterString) {
      parts.push(`filteri=${filterString}`);
    }

    if (sortString) {
      parts.push(`sort=${sortString}`);
    }

    if (page > 0) {
      parts.push(`strana=${page}`);
    }

    // Join with & and add ? prefix
    const query_string = parts.length > 0 ? `?${parts.join("&")}` : "";

    return query_string;
  };

  useEffect(() => {
    const query_string = updateURLQuery(page, selectedFilters, sort);
    router.push(query_string, { scroll: false });
  }, [selectedFilters, page, sort]);

  useEffect(() => {
    POST("/products/section/filters/action", { filters: [] }).then(
      (response) => {
        setAvailableFilters(response?.payload || []);
      },
    );
  }, []);

  const getPaginationArray = (selectedPage, totalPages) => {
    const start = Math.max(1, selectedPage - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const setSort = (newSort) => {
    const urlParams = new URLSearchParams(params.toString());
    if (newSort?.field && newSort?.direction) {
      urlParams.set(
        "sort",
        `${newSort.field}_${newSort.direction.toLowerCase()}`,
      );
    } else {
      urlParams.delete("sort");
    }
    router.push(`${pathname}?${urlParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <>
      {actionProducts?.payload?.items &&
        actionProducts.payload.items.length > 0 && (
          <BreadcrumbsStatic breadcrumbs={[{ name: "Na popustu" }]} />
        )}
      <div className="sectionPaddingX">
        <div className="sectionPaddingX bg-white pt-6 sm:pt-10">
          <div className="text-lg text-gold lg:text-[20px]">
            Crkveni Magacin
          </div>
          <h2 className="titleH2 text-left">Na popustu</h2>
        </div>
      </div>
      <div
        className={`sectionPaddingX sticky top-[47px] z-[51] flex items-center gap-5 bg-white pt-10 xl:hidden`}
      >
        <button
          className={`flex flex-1 items-center justify-center overflow-hidden rounded-[10px] border border-primary bg-white py-2 text-center text-base md:text-lg`}
          onClick={() => setFilterOpen(true)}
        >
          Filteri
        </button>
      </div>

      {!isLoading &&
      actionProducts?.payload?.items &&
      actionProducts.payload.items.length === 0 ? (
        <div className="flex w-full items-center justify-center py-12 text-center">
          <h1 className="text-lg">
            Trenutno nema proizvoda na popustu, ili izabrani filteri ne daju
            rezultate.
          </h1>
        </div>
      ) : (
        <>
          <div className="sectionPaddingX mx-auto w-full">
            <div
              className={`sectionPaddingX flex flex-col gap-10 bg-white !pt-6 max-xl:hidden sm:!pt-10 2xl:!pt-14 ${actionProducts?.payload?.pagination?.total_pages > 1 ? "sectionPaddingY" : ""}`}
            >
              <div className="max-md:hidden">
                <Filters
                  selectedFilters={selectedFilters}
                  availableFilters={availableFilters}
                  setSelectedFilters={setSelectedFilters}
                  setPage={setPage}
                  setSort={setSort}
                  changeFilters={changeFilters}
                  pagination={actionProducts?.payload?.pagination}
                  setTempSelectedFilters={setTempSelectedFilters}
                  setLastSelectedFilterKey={setLastSelectedFilterKey}
                  setChangeFilters={setChangeFilters}
                />
              </div>
              <div className="flex w-full flex-col gap-10">
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-3 2xl:grid-cols-4">
                  {actionProducts?.payload?.items?.map(({ id }) => (
                    <Suspense
                      key={`suspense-${id}`}
                      fallback={
                        <div
                          className={`aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
                        />
                      }
                    >
                      <Thumb slug={id} />
                    </Suspense>
                  )) ||
                    Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className={`aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto w-full bg-white">
            <div
              data-aos="fade-up"
              className={`sectionPaddingX pb-20 pt-10 xl:hidden`}
            >
              <div className="grid grid-cols-1 gap-x-[20px] gap-y-[36px] sm:grid-cols-2 lg:grid-cols-3 2xl:mt-[50px]">
                {actionProducts?.payload?.items?.map(({ id }) => (
                  <Suspense
                    key={`suspense-${id}`}
                    fallback={
                      <div
                        className={`aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
                      />
                    }
                  >
                    <Thumb slug={id} key={`$thumb-${id}`} />
                  </Suspense>
                )) ||
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-mobile-${index}`}
                      className={`aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
                    />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
      {actionProducts?.payload?.pagination?.total_pages > 1 &&
        process.env.PAGINATION_TYPE === "pagination" && (
          <CategoryPagination
            generateQueryString={(targetPage = page) => {
              const query_string = updateURLQuery(
                targetPage,
                selectedFilters,
                sort,
              );
              return query_string;
            }}
            data={{
              pagination: actionProducts.payload.pagination,
            }}
            page={page}
            slug="/akcija"
            setPage={setPage}
            getPaginationArray={getPaginationArray}
            withPagination
          />
        )}
      <div
        className={
          filterOpen
            ? `fixed left-0 top-0 z-[3000] h-[100dvh] w-full translate-x-0 bg-white duration-500`
            : `fixed left-0 top-0 z-[3000] h-[100dvh] w-full -translate-x-full bg-white duration-500`
        }
      >
        <FiltersMobile
          selectedFilters={selectedFilters}
          availableFilters={availableFilters}
          setSelectedFilters={setSelectedFilters}
          sort={sort}
          setSort={setSort}
          setPage={setPage}
          setFilterOpen={setFilterOpen}
          setTempSelectedFilters={setTempSelectedFilters}
          setChangeFilters={setChangeFilters}
          tempSelectedFilters={tempSelectedFilters}
          setLastSelectedFilterKey={setLastSelectedFilterKey}
        />
      </div>
    </>
  );
};

export default ActionProductsPage;
