import { currencyFormat } from "@/helpers/functions";

/**
 * Returns
 * status
 * of
 * the
 * price
 * @param {object} price -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {string}
 *     -
 *     The
 *     status
 *     of
 *     the
 *     price.
 */
export const getPriceStatus = (price) => {
  let status = "default";

  if (price?.discount?.active && price?.rebate?.active) {
    status = "discount_rebates";
  }
  if (price?.discount?.active && !price?.rebate?.active) {
    status = "discount";
  }
  if (price?.rebate?.active && !price?.discount?.active) {
    status = "rebates";
  }

  return status;
};

/**
 * Returns
 * are
 * prices
 * equal
 * @param {object} price -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {boolean}
 *     -
 *     Are
 *     prices
 *     equal.
 */
export const getArePricesEqual = (price) => {
  return price?.min?.price?.original === price?.max?.price?.original;
};

/**
 * Returns
 * status
 * of
 * the
 * inventory
 * @param {object} inventory -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     inventory
 *     data.
 * @returns {boolean}
 *     -
 *     The
 *     status
 *     of
 *     the
 *     inventory
 *     -
 *     is
 *     in
 *     stock
 *     or
 *     not.
 */
export const checkIsInStock = (inventory) => {
  return inventory?.inventory_defined && Number(inventory?.amount) > 0;
};

/**
 * Returns
 * status
 * of
 * the
 * inventory
 * @param {object} price -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {object}
 *     -
 *     The
 *     status
 *     of
 *     the
 *     price
 *     -
 *     is
 *     it
 *     defined
 *     and
 *     is
 *     it
 *     the
 *     range
 *     of
 *     prices.
 */
export const checkPrices = (price) => {
  let data = {};

  data.price_defined = !!(price?.price_defined && price?.price?.original > 0);

  data.price_range =
    price?.min?.price?.original > 0 && price?.max?.price?.original > 0;

  return data;
};

/**
 * Returns
 * status
 * of
 * the
 * inventory
 * @param {object} data -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {JSX.Element}
 *     -
 *     Default
 *     prices,
 *     without
 *     rebates
 *     or
 *     discounts.
 */
export const renderDefaultPrices = (data = {}) => {
  let is_range = data?.is_price_range;
  let price = data?.price;
  if (is_range) {
    let are_range_prices_equal = getArePricesEqual(price);
    if (are_range_prices_equal) {
      return (
        <p
          className={`text-left !font-semibold text-primary ${
            data?.is_details ? "text-base lg:!text-[19px]" : "!text-[15px]"
          }`}
        >
          {currencyFormat(price?.min?.price?.original, price?.currency)}
        </p>
      );
    } else {
      return (
        <p
          className={`text-left !font-semibold text-primary ${
            data?.is_details ? "text-base lg:!text-[19px]" : "!text-[15px]"
          }`}
        >
          {currencyFormat(price?.min?.price?.original, price?.currency)} -{" "}
          {currencyFormat(price?.max?.price?.original, price?.currency)}
        </p>
      );
    }
  } else {
    return (
      <p
        className={`text-left !font-semibold text-primary ${
          data?.is_details ? "text-base lg:!text-[19px]" : "!text-[15px]"
        }`}
      >
        {currencyFormat(price?.price?.original, price?.currency)}
      </p>
    );
  }
};

/**
 * Returns
 * status
 * of
 * the
 * inventory
 * @param {object} data -
 *     The
 *     object
 *     that
 *     holds
 *     the
 *     price
 *     data.
 * @returns {JSX.Element}
 *     -
 *     Prices
 *     after
 *     discount.
 */
export const renderDiscountPrices = (data = {}) => {
  let is_range = data?.is_price_range;
  let price = data?.price;

  const discount_number =
    price?.min?.length > 0 && price?.max?.length > 0
      ? Math.abs(price?.min?.price?.original - price?.min?.price?.discount)
      : Math.abs(price?.price?.original - price?.price?.discount);

  const discount_percent = Math.ceil(
    (discount_number /
      (price?.min?.length > 0 && price?.max?.length > 0
        ? price?.min?.price?.original
        : price?.price?.original)) *
      100,
  );

  if (is_range) {
    let are_range_prices_equal = getArePricesEqual(price);

    if (are_range_prices_equal) {
      return (
        <div className={`flex flex-row flex-wrap items-center gap-3 text-left`}>
          <p
            className={`text-[15px] font-semibold text-primary ${data?.is_details ? "text-base lg:!text-[19px]" : ""}`}
          >
            {currencyFormat(price?.min?.price?.discount, price?.currency)}
          </p>
          <div 
  className={`h-4 w-[1px] ${
    discount_percent > 0 ? "bg-yellow-400" : "bg-[#aeaeae]"
  } max-sm:hidden`} 
/>

          <div className="flex items-center gap-3">
            <div
              className={`group relative text-[15px] text-[#A4A4A4] line-through ${data?.is_details ? "text-base lg:!text-[19px]" : ""}`}
            >
              {currencyFormat(price?.min?.price?.original, price?.currency)}
            </div>
            {data?.is_details && (
              <div className="rounded-[3px] bg-[#2CC25D] px-4 py-0.5 text-[13px] font-bold text-white">
                -{discount_percent}%
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className={`flex flex-row flex-wrap items-center gap-3 text-left`}>
          <p
            className={`text-[15px] font-semibold text-primary ${data?.is_details ? "text-base lg:!text-[19px]" : ""}`}
          >
            {currencyFormat(price?.min?.price?.discount, price?.currency)} -{" "}
            {currencyFormat(price?.max?.price?.discount, price?.currency)}
          </p>
          <div 
  className={`h-4 w-[1px] ${
    discount_percent > 0 ? "bg-yellow-400" : "bg-[#aeaeae]"
  } max-sm:hidden`} 
/>

          <div className="flex items-center gap-3">
            <div
              className={`group relative text-[15px] text-[#A4A4A4] line-through ${data?.is_details ? "text-base lg:!text-[19px]" : ""}`}
            >
              {currencyFormat(price?.min?.price?.original, price?.currency)} -{" "}
              {currencyFormat(price?.max?.price?.original, price?.currency)}
            </div>
            {data?.is_details && (
              <div className="rounded-[3px] bg-[#2CC25D] px-4 py-0.5 text-[13px] font-bold text-white">
                -{discount_percent}%
              </div>
            )}
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className={`flex flex-row flex-wrap items-center gap-3 text-left`}>
        <p
          className={`text-[15px] font-semibold text-primary ${data?.is_details ? "text-base lg:!text-[19px]" : ""}`}
        >
          {currencyFormat(price?.price?.discount, price?.currency)}
        </p>
        <div 
  className={`h-4 w-[1px] ${
    discount_percent > 0 ? "bg-yellow-400" : "bg-[#aeaeae]"
  } max-sm:hidden`} 
/>

        <div className="flex items-center gap-3">
          <div
            className={`group relative text-[15px] text-[#A4A4A4] line-through ${data?.is_details ? "text-base lg:!text-[19px]" : ""}`}
          >
            {currencyFormat(price?.price?.original, price?.currency)}
          </div>
          {data?.is_details && (
            <div className="rounded-[3px] bg-[#2CC25D] px-4 py-0.5 text-[13px] font-bold text-white">
              -{discount_percent}%
            </div>
          )}
        </div>
      </div>
    );
  }
};
