import { Suspense } from "react";
import ActionProductsPage from "./components/ActionProductsPage";

const NaPopustu = () => {
  return (
    <Suspense
      fallback={
        <div className="grid gap-[11px] gap-y-[40px] max-md:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className="col-span-1 aspect-2/3 w-full animate-pulse bg-slate-300 object-cover"
                />
              );
            })}
          </>
        </div>
      }
    >
      <ActionProductsPage />
    </Suspense>
  );
};

export default NaPopustu;

export const metadata = {
  title: "Na popustu | Crkveni Magacin",
  description: "Dobrodošli na Crkveni Magacin",
};
