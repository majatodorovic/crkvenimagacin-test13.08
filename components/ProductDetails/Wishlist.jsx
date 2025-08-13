import Image from "next/image";
import React, { useEffect } from "react";
import {
  useAddToWishlist,
  useIsInWishlist,
  useRemoveFromWishlist,
} from "@/hooks/ecommerce.hooks";

const Wishlist = ({ product, refreshWishlist, withText = true }) => {
  const { mutate: addToWishlist, isSuccess: isAdded } = useAddToWishlist();

  const { mutate: removeFromWishlist, isSuccess: isRemoved } =
    useRemoveFromWishlist();

  const { data, refetch: reCheck } = useIsInWishlist({
    id: product?.basic_data?.id_product,
  });

  const isInWishlist = data?.exist;
  const wishlist_id = data?.wishlist_item_id;

  useEffect(() => {
    reCheck();
    if (isRemoved && refreshWishlist) {
      refreshWishlist();
    }
  }, [isAdded, isRemoved, refreshWishlist]);

  return (
    <div
      onClick={() => {
        if (isInWishlist) {
          removeFromWishlist({ id: wishlist_id });
        } else {
          addToWishlist({
            id: product?.basic_data?.id_product,
            name: product?.basic_data?.name,
          });
        }
      }}
      className={`wishlistGroup group flex cursor-pointer items-center gap-x-2 ${!withText ? "h-full w-full justify-center" : ""}`}
    >
      {isInWishlist ? (
        <Image
          src={`/icons/heart-active.svg`}
          alt="wishlist"
          width={20}
          height={20}
          className={`h-auto w-6 min-w-6`}
        />
      ) : (
        <Image
          src={`/icons/heart.svg`}
          alt="wishlist"
          width={20}
          height={20}
          className={`redFilter h-auto w-5 min-w-5`}
        />
      )}
      {withText && (
        <span className="mb-0.5 text-[15px]">
          {isInWishlist ? "U listi želja" : "Dodajte u listu želja"}
        </span>
      )}
    </div>
  );
};

export default Wishlist;
