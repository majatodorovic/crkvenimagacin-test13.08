"use client";
import { useContext, useEffect, useState } from "react";
import {
  useBillingAddresses,
  useCheckout,
  useGetAddress,
  useIsLoggedIn,
  useGetAccountData,
  useCartBadge,
  useRemoveFromCart,
  useCheckoutCreateAccount,
} from "@/hooks/ecommerce.hooks";
import { handleCreditCard, handleSetData } from "@/components/Cart/functions";
import { useRouter } from "next/navigation";
import { post as POST } from "@/api/api";
import CheckoutUserInfo from "@/components/Cart/CheckoutUserInfo";
import CheckoutOptions from "@/components/Cart/CheckoutOptions";
import CheckoutTotals from "@/components/Cart/CheckoutTotals";
import CheckoutItems from "@/components/Cart/CheckoutItems";
import Spinner from "@/components/UI/Spinner";
import { userContext } from "@/context/userContext";
import CheckoutButton from "@/components/Cart/CheckoutButton";
import NoStockModal from "@/components/Cart/NoStockModal";
import GeneralTermsOfUseField from "@/components/Cart/GeneralTermsOfUseField";
import { filterOutProductsOutOfStock } from "@/components/Cart/helper/outOfStock";
import { useForm, useLogin } from "@/hooks/ecommerce.hooks";
import {
  Form,
  handleInputChange,
  handleSubmit,
} from "@/_components/shared/form";

const fields = [
  {
    id: 1,
    name: "email",
    placeholder: "Unesite email",
    label: "Email",
    required: true,
    type: "email",
  },
  {
    id: 2,
    name: "password",
    placeholder: "Unesite lozinku",
    label: "Lozinka",
    required: true,
    type: "password",
  },
];

export const CheckoutData = ({
  payment_options,
  delivery_options,
  summary,
  items,
  refreshCart,
  refreshSummary,
  dataTmp,
  setDataTmp,
  errorsTmp,
  setErrorsTmp,
  totals,
  token,
}) => {
  const router = useRouter();
  const { data: cartCount } = useCartBadge();
  const [selected, setSelected] = useState({
    id: null,
    use_same_data: true,
  });
  const {
    data: dataLogin,
    setErrors,
    errors,
    setData,
  } = useForm({
    email: "",
    password: "",
  });
  const { mutate: login, isPending: isPendingLogin } = useLogin();
  const { mutate: removeFromCart, isSuccess: isRemoved } = useRemoveFromCart();
  const { mutate: checkoutCreateAccount, isSuccess: isAccountCreated } =
    useCheckoutCreateAccount();
  const [sureCheck, setSureCheck] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [registerChecked, setRegisterChecked] = useState(false);
  const [registerPassword, setRegisterPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const { loggedIn: userLoggedIn } = useContext(userContext);

  const { data: loggedIn } = useIsLoggedIn();

  const { data: billing_addresses } = userLoggedIn ? useBillingAddresses() : [];

  const { data: user_billing_addresses } = userLoggedIn
    ? useGetAccountData({ api: `/customers/billing-address`, method: "list" })
    : [];

  const { data: form, isLoading } = useGetAddress(
    billing_addresses?.length > 1 && selected?.id
      ? selected?.id
      : billing_addresses?.[0]?.id,
    "billing",
    loggedIn && Boolean(billing_addresses?.length),
  );

  const [postErrors, setPostErrors] = useState({
    fields: [],
  });

  const [isClosed, setIsClosed] = useState(false);

  const {
    data: checkOutData,
    mutate: checkOutMutate,
    isPending,
    isSuccess: isCheckoutSuccess,
  } = useCheckout({
    formData: dataTmp,
    setPostErrors: setPostErrors,
  });

  useEffect(() => {
    const defaultAddress = user_billing_addresses?.items?.find(
      (address) => address.set_default === 1,
    );
    if (defaultAddress) {
      const { id: billing_id } = defaultAddress;
      setSelected((prev) => ({
        ...prev,
        id: billing_id,
      }));
    }
  }, [user_billing_addresses?.items]);

  useEffect(() => {
    if (items && !isClosed) {
      const productOutOfStock = filterOutProductsOutOfStock(items);

      setPostErrors((prevErrors) => ({
        ...prevErrors,
        fields: productOutOfStock,
      }));
    }
  }, [items]);

  useEffect(() => {
    if (isCheckoutSuccess && checkOutData) {
      switch (true) {
        case Boolean(checkOutData?.payment_provider_data?.form) === false:
          return router.push(
            `/korpa/kupovina/${checkOutData?.order?.order_token}`,
          );
        case Boolean(checkOutData?.payment_provider_data?.form) === true:
          return handleCreditCard(checkOutData);
        default:
          break;
      }
    }
  }, [isCheckoutSuccess, checkOutData, router]);

  // Auto login after successful account creation
  useEffect(() => {
    if (isAccountCreated && registrationData) {
      const { email, password } = registrationData;
      // Direct login without redirect
      POST(`/customers/sign-in/login`, {
        email: email,
        password: password,
      }).then((res) => {
        if (res?.code === 200) {
          // Set cookie and update login state without redirect
          const customer_token = res?.payload?.customer_token;
          if (customer_token) {
            // Set the cookie directly
            document.cookie = `customer_token=${customer_token}; expires=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
            // Continue with checkout after successful login
            checkOutMutate();
          }
        }
      });
      setRegistrationData(null); // Clear the data after login attempt
    }
  }, [isAccountCreated, registrationData, checkOutMutate]);

  useEffect(
    () => {
      if (!isLoading) {
        handleSetData("default_data", form, dataTmp, setDataTmp);
      }
    },
    [selected?.id, form?.[0]],
    isLoading,
  );

  useEffect(() => {
    if (selected?.use_same_data) {
      return handleSetData("same_data", form, dataTmp, setDataTmp);
    } else {
      return handleSetData("different_data", form, dataTmp, setDataTmp);
    }
  }, [selected?.id, selected?.use_same_data]);

  useEffect(() => {
    if (isRemoved) {
      refreshCart();
      refreshSummary();
    }
  }, [isRemoved]);

  return (
    <div
      className={`grid grid-cols-6 gap-10 2xl:grid-cols-6 2xl:gap-16 2xl:gap-[140px]`}
    >
      <div className={`col-span-6 flex flex-col lg:col-span-3`}>
        {!userLoggedIn && (
          <div>
            <div className={`flex flex-col gap-3`}>
              <h2 className="text-2xl font-normal">
                Ukoliko imate profil, možete se prijaviti.
              </h2>
              <div className="h-[2px] w-full bg-primary" />
            </div>
            <Form
              data={dataLogin}
              errors={errors}
              fields={fields}
              isPending={isPendingLogin}
              handleSubmit={(e) => {
                handleSubmit(e, dataLogin, setData, login, fields, setErrors);
              }}
              setData={setData}
              handleInputChange={(e) => {
                handleInputChange(e, setData, setErrors);
              }}
              showOptions={false}
              button_text={`Prijavite se`}
              buttonClassName={"sm:!w-[210px] !rounded-full text-sm !py-3 mt-2"}
            />
            <div className="my-10 text-center text-2xl font-semibold 2xl:my-20">
              Ili nastavite kao gost
            </div>
          </div>
        )}
        <CheckoutUserInfo
          errors={errorsTmp}
          selected={selected}
          setErrors={setErrorsTmp}
          setFormData={setDataTmp}
          formData={dataTmp}
        />
        {!userLoggedIn && (
          <>
            <div
              className={`${
                registerChecked ? "mb-5" : "mb-10"
              } flex items-center gap-2`}
            >
              <input
                type="checkbox"
                id="register-as-guest"
                className="peer hidden"
                checked={registerChecked}
                onChange={(e) => setRegisterChecked(e.target.checked)}
              />
              <label
                htmlFor={`register-as-guest`}
                className="h-4.5 w-4.5 flex cursor-pointer items-center justify-center rounded-sm border border-black bg-white px-[2px] py-[1px] text-[12px] text-white peer-checked:text-gold"
              >
                <i className="fa fa-check hidden"></i>
              </label>
              <label htmlFor={`register-as-guest`} className={`text-[15px]`}>
                Registruj me sa ovim podacima
              </label>
            </div>
            {registerChecked && (
              <div className="mb-10">
                <div>
                  <label htmlFor="register-password" className="text-[15px]">
                    Lozinka
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      setPasswordError(false);
                    }}
                    placeholder="Unesite lozinku"
                    className={`mainInput ${
                      passwordError
                        ? "!ring-1 !ring-red-500 !ring-offset-2 !ring-offset-white"
                        : ""
                    }`}
                    required={registerChecked}
                  />
                  {passwordError && (
                    <div className={`mt-1 text-xs text-red-500`}>
                      Ovo polje je obavezno.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <CheckoutOptions
          errors={errorsTmp}
          setErrors={setErrorsTmp}
          delivery_options={delivery_options}
          payment_options={payment_options}
          setFormData={setDataTmp}
          formData={dataTmp}
        />
      </div>

      <div
        className={`col-span-6 flex flex-col gap-3 md:col-span-4 lg:col-span-3 2xl:col-span-3`}
      >
        <div className={`mb-2 flex flex-col gap-3`}>
          <h2 className="text-2xl font-normal">
            Proizvodi u korpi ({cartCount})
          </h2>
          <div className="h-[2px] w-full bg-primary" />
        </div>
        <div
          className={`customScroll mb-12 mt-5 flex max-h-[520px] flex-col gap-5 overflow-y-auto pr-6 sm:mb-10 2xl:mb-20`}
        >
          {(items ?? [])?.map(({ product, cart }, index) => (
            <CheckoutItems
              product={product}
              cart={cart}
              key={index}
              refreshCart={refreshCart}
              isClosed={isClosed}
              refreshSummary={refreshSummary}
              onRemove={() => {
                setSureCheck(true);
                setItemToRemove(cart?.cart_item_id);
              }}
            />
          ))}
        </div>
        <CheckoutTotals summary={summary} totals={totals} />
        <GeneralTermsOfUseField
          dataTmp={dataTmp}
          setDataTmp={setDataTmp}
          errorsTmp={errorsTmp}
          setErrorsTmp={setErrorsTmp}
        />
        <CheckoutButton
          isPending={isPending}
          dataTmp={dataTmp}
          setErrorsTmp={setErrorsTmp}
          checkOutMutate={() => {
            if (!userLoggedIn && registerChecked) {
              if (!registerPassword.trim()) {
                setPasswordError(true);
                return;
              }
              const email = dataTmp.email_billing || dataTmp.email_shipping;
              const payload = {
                customer_type: dataTmp.customer_type || "individual",
                first_name:
                  dataTmp.first_name_billing || dataTmp.first_name_shipping,
                last_name:
                  dataTmp.last_name_billing || dataTmp.last_name_shipping,
                phone: dataTmp.phone_billing || dataTmp.phone_shipping,
                email: email,
                password: registerPassword,
                gender: dataTmp.gender || null,
                birth_date: dataTmp.birth_date || null,
                accept_terms: dataTmp.accept_rules ? 1 : 0,
                accept_newsletter: dataTmp.accept_newsletter ? 1 : 0,
                company_name: dataTmp.company_name || null,
                pib: dataTmp.pib || null,
                maticni_broj: dataTmp.maticni_broj || null,
                ip_address: dataTmp.ip_address || null,
                note: dataTmp.note || null,
                auto_generate_password: 0,
              };
              // Store registration data for auto login
              setRegistrationData({ email, password: registerPassword });
              checkoutCreateAccount(payload);
            }
            checkOutMutate();
          }}
          selected={selected}
          setDataTmp={setDataTmp}
          token={token}
        />
      </div>
      <NoStockModal
        postErrors={postErrors}
        setPostErrors={setPostErrors}
        setIsClosed={setIsClosed}
        refreshSummary={refreshSummary}
        refreshCart={refreshCart}
      />
      {sureCheck && (
        <div
          className="fixed left-0 top-0 z-[10000] flex h-full w-full items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSureCheck(false)}
        >
          <div
            className="mx-2 rounded-lg bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-lg">
              Da li ste sigurni da želite da uklonite proizvod iz korpe?
            </span>
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                className="mainButton"
                onClick={() => {
                  removeFromCart({ id: itemToRemove });
                  setSureCheck(false);
                }}
              >
                Da
              </button>
              <button
                className="invertedButton"
                onClick={() => setSureCheck(false)}
              >
                Ne
              </button>
            </div>
          </div>
        </div>
      )}
      {isCheckoutSuccess && checkOutData?.credit_card === null && (
        <div
          className={`fixed left-0 top-0 z-[100] flex h-[100dvh] w-screen flex-col items-center justify-center bg-black/50 opacity-100 backdrop-blur-md transition-all duration-500`}
        >
          <Spinner className={`!scale-125`} />
        </div>
      )}
    </div>
  );
};
