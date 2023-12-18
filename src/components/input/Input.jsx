import { Countrydropdown } from "./countryDropdown/Countrydropdown";
import { gsap } from "gsap";
import "./input.css";

export const Input = ({
  setInputTown,
  townEntered,
  setInputCountry,
  setIsUS,
  countryRef,
}) => {
  // ~ set Refs

  // ! when non US zip is checked
  const checked = (e) => {
    // ? define defaults for gsap
    let tl = gsap.timeline({
      defaults: { duration: 0.5, ease: "power2.out", delay: 0 },
    });
    if (e.target.checked !== undefined) {
      if (e.target.checked) {
        setIsUS(false);
        e.target.setAttribute(
          "style",
          "background-color: #1b93ff ; border-color: #1b93ff;"
        );
        tl.to(countryRef.current, { height: "40px" }).to(countryRef.current, {
          overflow: "visible",
        });
      } else {
        setIsUS(true);
        e.target.setAttribute(
          "style",
          "background-color: #fff ; border-color: #fff;"
        );
        tl.to(countryRef.current, { overflow: "hidden" }).to(
          countryRef.current,
          { height: "0px" },
          "<"
        );
      }
    }
  };
  // ! make input text disappear
  const clickInput = (e) => {
    e.target.value !== "" && (e.target.value = "");
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
          onClick={(e) => clickInput(e)}
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
        <button type='button' className='btnEnter' onClick={townEntered}>
          <span className='material-symbols-outlined'>
            keyboard_arrow_right
          </span>
        </button>
      </div>

      <Countrydropdown
        setInputCountry={setInputCountry}
        countryRef={countryRef}
      />
    </div>
  );
};
