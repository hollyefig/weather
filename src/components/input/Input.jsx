import { Countrydropdown } from "./countryDropdown/Countrydropdown";

export const Input = ({
  setInputTown,
  townEntered,
  setInputCountry,
  inputCountry,
}) => {
  return (
    <div>
      {/* possibly address-level2  */}
      <input
        type='text'
        autoComplete='address-level2'
        onInput={(e) => setInputTown(e.target.value)}
        className='inputTown'
        placeholder='city or ZIP'
      />

      <Countrydropdown
        setInputCountry={setInputCountry}
        inputCountry={inputCountry}
      />

      <button type='button' className='btnTown' onClick={townEntered}>
        Enter
      </button>
    </div>
  );
};
