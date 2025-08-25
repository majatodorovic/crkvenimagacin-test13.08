import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/ecommerce.hooks";
import {
  checkIsAddableToCart,
  cartTextBySelectedVariant,
} from "./helpers/addToCart";
import Wishlist from "./Wishlist";

const AddToCart = ({
  displayComponent,
  selectedOptions,
  productQuantity,
  productVariant,
  product,
  tempError,
  setTempError,
}) => {
  if (!displayComponent) return <></>;
  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();

  const productItem = product?.data?.item;

  const isAddableToCart = checkIsAddableToCart({
    price: productVariant?.id ? productVariant?.price : productItem?.price,
    inventory: productVariant?.id
      ? productVariant?.inventory
      : productItem?.inventory,
  });

  const handleAddToCart = () => {
    switch (product?.product_type) {
      case "single": {
        let is_addable = checkIsAddableToCart({
          price: productItem?.price,
          inventory: productItem?.inventory,
        });
        if (is_addable?.addable) {
          addToCart({
            id: productItem?.basic_data?.id_product,
            quantity: productQuantity,
          });
          return true;
          // pushToDataLayer("add_to_cart", productItem, productQuantity);
        } else {
          router.push(
            `/kontakt?proizvodIme=${productItem?.basic_data.name}&proizvodId=${productItem?.id}`,
          );
        }
        break;
      }
      case "variant": {
        if (productVariant?.id) {
          let is_addable = checkIsAddableToCart({
            price: productVariant?.price,
            inventory: productVariant?.inventory,
          });

          if (is_addable?.addable) {
            addToCart({
              id: productVariant?.id,
              quantity: productQuantity,
            });
            return true;
            // pushToDataLayer("add_to_cart", productVariant, productQuantity);
          } else {
            router.push(
              `/kontakt?proizvodIme=${productItem?.basic_data.name}&proizvodId=${productVariant?.id}&atribut=${productVariant?.basic_data.attributes_text}`,
            );
          }
        } else {
          let text = cartTextBySelectedVariant({ selectedOptions, product });
          setTempError(text);
        }
        break;
      }
      default:
        break;
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-y-4">
      <button
        disabled={isPending}
        className={`mainButton w-full max-w-[320px] !bg-gold !py-2 !text-base !text-black hover:!bg-primary hover:!text-white lg:!py-4 lg:!text-[19px]`}
        onClick={() => {
          handleAddToCart();
        }}
      >
        {isPending
          ? "Dodajem..."
          : tempError
            ? tempError
            : isAddableToCart?.text}
      </button>
      {product && <Wishlist product={product?.data?.item} />}
    </div>
  );
};

export default AddToCart;
