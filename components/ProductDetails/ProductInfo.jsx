"use client";
import { Suspense, useState } from "react";
import AddToCart from "@/components/ProductDetails/AddToCart";
import ProductPrice from "@/components/ProductPrice/ProductPrice";
import { getDataFromCurrentProduct } from "@/components/ProductDetails/helpers/productInfo";
import { ProductGallery } from "@/components/ProductDetails/ProductGallery";
import Image from "next/image";

export const ProductInfo = ({ id, product, productGallery }) => {
  const itemBasicData = product?.data?.item?.basic_data;
  const [tempError, setTempError] = useState(null);
  const { behaviours, inventory, selectedProduct, sku, price } =
    getDataFromCurrentProduct({
      productVariant: null,
      product,
    });

  return (
    <div className="sectionPaddingX flex flex-col gap-7 bg-white pt-6 md:flex-row lg:pt-10 xl:gap-x-10 2xl:pt-14">
      <div className="w-[38%] max-lg:hidden">
        <Suspense fallback={<Loader />}>
          <div className="mb-1 text-[15px] text-gold">
            {product?.data?.item?.categories[0].name}
          </div>
          <h1 className="mb-8 line-clamp-3 text-[29px] font-medium leading-[normal]">
            {itemBasicData?.name}
          </h1>
          <ProductPrice
            selectedProduct={selectedProduct}
            displayComponent={
              behaviours?.customer_settings?.product_price?.display_to_guest
            }
            is_details
            price={price}
            inventory={inventory}
            className={
              price?.discount?.active
                ? `py-0.5 text-[21px] font-bold`
                : `py-0.5 text-[1.172rem] font-bold`
            }
          />
          <div className="mb-8 mt-6 h-[1px] w-[170px] bg-gold" />
          {itemBasicData?.description && (
            <div
              className="prose max-w-full text-[15px] leading-[normal] text-black"
              dangerouslySetInnerHTML={{ __html: itemBasicData?.description }}
            />
          )}
        </Suspense>
      </div>

      <ProductGallery
        productGallery={productGallery}
        variantKeyArray={null}
        id={id}
      />

      <div className="w-full md:w-1/2 lg:w-[27%]">
        <Suspense fallback={<Loader />}>
          <div className="mb-5 flex flex-col lg:hidden">
            <div className="mb-1 text-[15px] text-gold">
              {product?.data?.item?.categories[0].name}
            </div>
            <h1 className="mb-5 line-clamp-3 text-[22px] font-medium leading-[normal]">
              {itemBasicData?.name}
            </h1>
            <ProductPrice
              selectedProduct={selectedProduct}
              displayComponent={
                behaviours?.customer_settings?.product_price?.display_to_guest
              }
              is_details
              price={price}
              inventory={inventory}
              className={
                price?.discount?.active
                  ? `py-0.5 text-[21px] font-bold`
                  : `py-0.5 text-[1.172rem] font-bold`
              }
            />
            <div className="my-4 h-[1px] w-[215px] bg-gold" />
            {itemBasicData?.description && (
              <div
                className="prose max-w-full text-[15px] leading-[normal] text-black"
                dangerouslySetInnerHTML={{ __html: itemBasicData?.description }}
              />
            )}
          </div>
          <div className="flex w-[180px] items-center rounded-[5px] bg-[#AAD437] px-3 py-0.5 text-[15px]">
            <Image
              src="/icons/amount.svg"
              alt="amount"
              width={19}
              height={19}
              className="mr-1.5"
            />{" "}
            Na stanju:
            <span className="ml-[3px] font-medium">
              {parseInt(product?.data?.item?.inventory?.amount)}
            </span>
          </div>
          <h2 className="mt-2.5 text-[15px]">
            {selectedProduct && sku ? (
              <>
                Šifra: <span className="font-medium">{sku}</span>
              </>
            ) : (
              <>&nbsp;</>
            )}
          </h2>
          <div className="my-4 h-[1px] w-[215px] bg-gold" />
          {itemBasicData?.short_description && (
            <div
              className="prose mb-7 max-w-full text-[15px] leading-[normal] text-black 2xl:mb-10"
              dangerouslySetInnerHTML={{
                __html: itemBasicData?.short_description,
              }}
            />
          )}
          <AddToCart
            displayComponent={
              behaviours?.customer_settings?.purchase?.allow_purchase_to_guest
            }
            selectedOptions={null}
            productVariant={null}
            productQuantity={1}
            product={product}
            tempError={tempError}
            setTempError={setTempError}
          />
          <div className="my-4 h-[1px] w-[215px] bg-gold" />
          <div className="flex items-center gap-x-1 text-[15px]">
            Kategorija:
            <span className="font-medium">
              {product?.data?.item?.categories[0].name}
            </span>
          </div>
          {/* <Specifications id={id} /> */}
        </Suspense>
      </div>
    </div>
  );
};

const Loader = () => {
  return (
    <div className={`mt-5`}>
      <div className={`h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-10 h-2 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-10 h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-5 h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-5 h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-5 h-5 w-full animate-pulse bg-slate-300`}></div>
      <div className={`mt-5 h-5 w-full animate-pulse bg-slate-300`}></div>
    </div>
  );
};
