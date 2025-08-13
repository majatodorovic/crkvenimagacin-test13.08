import { currencyFormat } from "@/helpers/functions";

const CheckoutTotals = ({ summary, totals }) => {
  return (
    <div>
      <div className={`flex flex-col gap-2`}>
        <h2 className="text-xl">Vrednost vaše korpe:</h2>
      </div>
      <div className={`mt-12 flex flex-col`}>
        <div className={`flex items-center justify-between py-3`}>
          <p className={`text-lg`}>Iznos porudžbine:</p>
          <p className={`text-lg`}>
            {currencyFormat(summary?.totals?.with_vat)}
          </p>
        </div>
        <div
          className={`flex items-center justify-between border-t border-t-gold py-3`}
        >
          <p className={`text-lg`}>Popust:</p>
          <p className={`text-lg`}>
            {summary?.totals?.items_discount_amount +
              summary?.totals?.cart_discount_amount >
              0 && <span>-</span>}
            {currencyFormat(
              summary?.totals?.items_discount_amount +
                summary?.totals?.cart_discount_amount,
            )}
          </p>
        </div>
        <div
          className={`flex items-center justify-between border-t border-t-gold py-3`}
        >
          <p className={`text-lg`}>Dostava:</p>
          <p className={`text-lg`}>
            {/* Checkout if the delivery is free */}
            {summary?.totals?.cart_discount >
            summary?.options?.delivery?.free_delivery?.amount ? (
              <span className="uppercase text-[#48B02C]">Besplatna </span>
            ) : (
              <span>{currencyFormat(summary?.totals?.delivery_amount)}</span>
            )}
          </p>
        </div>
        <div
          className={`flex items-center justify-between border-t border-t-gold py-3`}
        >
          <p className={`text-lg font-medium`}>Ukupno za naplatu:</p>
          <p className={`text-lg font-medium`}>
            {currencyFormat(summary?.totals?.total)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutTotals;
