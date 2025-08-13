"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartBadge, useWishlistBadge } from "@/hooks/ecommerce.hooks";

const HeaderIcons = () => {
  const { data: cartCount } = useCartBadge();
  const { data: wishListCount } = useWishlistBadge();

  return (
    <div className="flex items-center gap-2.5">
      <Link
        href="/login"
        className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-gold"
      >
        <Image
          src="/icons/user.png"
          width={21}
          height={21}
          className="mainColorFilter h-auto w-5 min-w-5 object-cover invert"
          alt="user"
        />
      </Link>
      <Link
        href="/lista-zelja"
        className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-gold"
      >
        <Image
          src="/icons/heart.svg"
          width={21}
          height={21}
          className="mainColorFilter whiteFilter h-auto w-5 min-w-5 object-cover"
          alt="heart"
        />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 min-w-5 items-center justify-center rounded-full bg-white text-[13px] text-primary">
          {wishListCount}
        </span>
      </Link>

      <Link
        href="/korpa"
        className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-gold"
      >
        <Image
          src="/icons/trolley.svg"
          width={21}
          height={21}
          className="mainColorFilter h-auto w-6 min-w-6 object-cover invert"
          alt="shopping-bag"
        />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 min-w-5 items-center justify-center rounded-full bg-white text-[13px] text-primary">
          {cartCount}
        </span>
      </Link>
    </div>
  );
};

export default HeaderIcons;
