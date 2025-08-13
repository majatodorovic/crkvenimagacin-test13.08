"use client";
import Image from "next/image";
import { useUpdateCartQuantity } from "@/hooks/ecommerce.hooks";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/helpers/functions";
import PlusMinusInput from "@/components/PlusMinusInput";
import Link from "next/link";
import { CloseIcon } from "../svg/CloseIcon";

const CheckoutItems = ({
  product,
  cart,
  refreshCart,
  refreshSummary,
  isClosed,
  onRemove,
}) => {
  const { mutate: updateCart, isSuccess: isUpdated } = useUpdateCartQuantity();

  const {
    basic_data: { name, sku },
    price,
    inventory,
    image,
    link: { link_path: slug_path },
    behaviours: { checkout },
  } = product;

  const { quantity, cart_item_id } = cart;

  const [productQuantity, setProductQuantity] = useState(Number(quantity));

  useEffect(() => {
    if (Number(quantity) !== productQuantity) {
      updateCart({
        id: cart_item_id,
        quantity: productQuantity,
      });
    }
  }, [productQuantity]);

  useEffect(() => {
    setProductQuantity(Number(quantity));
  }, [quantity]);

  useEffect(() => {
    if (isUpdated) {
      refreshCart();
      refreshSummary();
    }
  }, [isUpdated]);

  return (
    <div
      className={`relative grid grid-cols-[110px_1fr] items-start justify-start gap-5 sm:grid-cols-[210px_1fr]`}
    >
      <button
        className={`absolute left-2.5 top-2.5 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-primary text-white ${
          isClosed && !inventory?.inventory_defined && "text-white"
        }`}
        onClick={() => {
          if (typeof onRemove === "function") {
            onRemove();
          }
        }}
      >
        <CloseIcon />
      </button>
      <Link
        href={`/${slug_path}`}
        className="w-full rounded-[5px] border border-[#D2D2D2] px-8 py-4 sm:px-12 sm:py-7"
      >
        <Image
          src={image?.[0] ?? "/images/placeholder.jpg"}
          alt={`Comr`}
          width={0}
          height={0}
          sizes={`90vw`}
          className={`aspect-[3/4] w-full border border-white bg-white object-cover`}
        />
      </Link>
      <div className={`mb-auto ml-2 flex flex-col items-start pr-12 pt-2`}>
        <h4 className={`mb-2 line-clamp-2 pr-14 text-[17px] leading-[normal]`}>
          {name}
        </h4>
        <p className={`mt-7 text-[15px]`}>
          Šifra:&nbsp;<span className={`font-medium`}>{sku}</span>
        </p>
        <PlusMinusInput
          label="Količina:"
          displayComponent={checkout.display.quantity_field}
          behaviours={checkout}
          maxAmount={+inventory?.amount}
          quantity={productQuantity}
          setQuantity={setProductQuantity}
          quantityError={() => {
            return false;
          }}
        />
        <div className={`mt-2 flex items-center gap-2 text-base`}>
          <span className="whitespace-nowrap font-semibold">
            {currencyFormat(price?.per_item?.total)}
          </span>
          <div className="text-[#E75C25]">|</div>
          <span className="whitespace-nowrap text-[#8D8D8D] line-through">
            {currencyFormat(price?.per_item?.price_with_vat)}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-[#398700]">
          Ušteda: &nbsp;{currencyFormat(price?.per_item?.discount?.amount)}
        </p>
      </div>
      {isClosed && !inventory?.inventory_defined && (
        <div
          className={`absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-black/40`}
        ></div>
      )}
    </div>
  );
};

export default CheckoutItems;
