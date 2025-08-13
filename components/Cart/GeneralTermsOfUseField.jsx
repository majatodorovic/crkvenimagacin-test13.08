const GeneralTermsOfUseField = ({
  dataTmp,
  setDataTmp,
  errorsTmp,
  setErrorsTmp,
}) => {
  return (
    <div className={`mt-10 flex flex-col`}>
      <div className="relative flex items-center gap-3 py-2">
        <input
          type="checkbox"
          id="accept_rules"
          name="accept_rules"
          onChange={(e) => {
            setDataTmp({
              ...dataTmp,
              accept_rules: e?.target?.checked,
            });
            setErrorsTmp(
              errorsTmp?.filter((error) => error !== "accept_rules"),
            );
          }}
          checked={dataTmp?.accept_rules}
          className="peer hidden"
        />
        <label
          htmlFor="accept_rules"
          className="h-4.5 w-4.5 flex cursor-pointer items-center justify-center rounded-sm border border-black bg-white px-[2px] py-[1px] text-[12px] text-white peer-checked:text-gold"
        >
          <i className="fa fa-check hidden"></i>
        </label>
        <label htmlFor="agreed" className={`text-[15px]`}>
          Saglasan sam sa{" "}
          <a
            className={`underline`}
            href={`/strana/uslovi-koriscenja`}
            target={`_blank`}
          >
            <span>Opštim uslovima kupovine</span>
          </a>
        </label>
      </div>
      {errorsTmp?.includes("accept_rules") && (
        <p className={`text-[0.75rem] text-red-500`}>
          Molimo Vas da prihvatite uslove korišćenja.
        </p>
      )}
    </div>
  );
};

export default GeneralTermsOfUseField;
