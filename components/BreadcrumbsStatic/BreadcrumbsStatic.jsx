"use client";
import Link from "next/link";

const BreadcrumbsStatic = ({ breadcrumbs = [] }) => {
  const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

  const slugToTitleMap = {
    "uslovi-koriscenja": "Uslovi korišćenja",
    "pravo-na-odustajanje": "Pravo na odustajanje",
    "zamena-artikala": "Zamena artikala",
    "kako-kupiti": "Kako kupiti",
    "o-nama": "O nama",
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-0 top-0 -z-10 h-[350px] w-full bg-primary"></div>
      <div className="sectionPaddingX pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pt-10">
          <Link
            className={`whitespace-nowrap text-[12px] text-white`}
            href={`/`}
          >
            Crkevni magacin
          </Link>

          {breadcrumbs.map((breadcrumb, index) => {
            const slugKey = breadcrumb.name.toLowerCase().replaceAll(" ", "-");
            const label =
              slugToTitleMap[slugKey] || capitalize(breadcrumb.name);

            return (
              <div key={index} className="flex">
                <span className="mr-2 text-[12px] text-white">/</span>
                {breadcrumb.url ? (
                  <Link
                    href={breadcrumb.url}
                    className={`whitespace-nowrap text-[12px] text-white ${index + 1 === breadcrumbs.length && "underline"}`}
                  >
                    {label}
                  </Link>
                ) : (
                  <div
                    className={`whitespace-nowrap text-[12px] text-white ${index + 1 === breadcrumbs.length && "underline"}`}
                  >
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbsStatic;
