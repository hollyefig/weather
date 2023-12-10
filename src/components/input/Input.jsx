import { useRef } from "react";
import { Countrydropdown } from "./countryDropdown/Countrydropdown";
import { gsap } from "gsap";
import "./input.css";

export const Input = ({
  setInputTown,
  townEntered,
  setInputCountry,
  setIsUS,
}) => {
  const countryRef = useRef(null);

  // ! when non US zip is checked
  const checked = (e) => {
    // ? define defaults for gsap
    let tl = gsap.timeline({
      defaults: { duration: 0.5, ease: "power2.out", delay: 0 },
    });
    if (e.target.checked !== undefined) {
      if (e.target.checked) {
        setIsUS(false);
        tl.to(countryRef.current, { height: "40px" }).to(countryRef.current, {
          overflow: "visible",
        });
      } else {
        setIsUS(true);
        tl.to(countryRef.current, { overflow: "hidden" }).to(
          countryRef.current,
          { height: "0px" },
          "<"
        );
      }
    }
  };
  return (
    <div className='input'>
      <div className='inputDefault'>
        {/* possibly address-level2  */}
        <input
          type='text'
          autoComplete='address-level2'
          onInput={(e) => setInputTown(e.target.value)}
          className='inputTownZip'
          placeholder='city or ZIP'
        />
        {/*  checkbox section */}
        <div className='checkboxSection'>
          <input
            type='checkbox'
            name='checkZip'
            id='checkZip'
            onClick={(e) => checked(e)}
          />
          <label
            htmlFor='checkZip'
            className='checkZip'
            onClick={(e) => checked(e)}
          >
            non-US zipcode?
          </label>
        </div>
        {/*  END checkbox section */}
      </div>

      <Countrydropdown
        setInputCountry={setInputCountry}
        countryRef={countryRef}
      />

      <button type='button' className='btnEnter' onClick={townEntered}>
        Enter
      </button>
    </div>
  );
};
