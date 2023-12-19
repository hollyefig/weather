import { Countrydropdown } from "./countryDropdown/Countrydropdown";
import { useRef } from "react";
import { gsap } from "gsap";
import "./input.css";
import { Fav } from "./Fav";

export const Input = ({
  setInputTown,
  townEntered,
  setInputCountry,
  setIsUS,
  countryRef,
  deg,
  setDeg,
  setTempUnit,
  storageState,
  setStorageState,
  inputTown,
  setCounter,
}) => {
  // ~ set Refs
  const hiddenInputsRef = useRef(null);
  const favListRef = useRef(null);
  const favArrow = useRef(null);

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

  // & clicked menu dropdown
  const burgerClicked = () => {
    let favArrowDown =
      getComputedStyle(favArrow.current).transform ===
      "matrix(0, 1, -1, 0, 0, 0)";
    let currentHeight = getComputedStyle(hiddenInputsRef.current).height;

    gsap
      .timeline({ defaults: { duration: 0.3 } })
      .to(".hiddenInputs", {
        height: currentHeight === "0px" ? "auto" : 0,
      })
      .to(
        ".input",
        {
          backgroundColor:
            currentHeight === "0px" ? "#0000002e" : "transparent",
        },
        "<"
      )
      .to(".favsList", { height: currentHeight !== "0px" && "0px" }, "<")
      .add(
        // if logic passes, fav arrow must rotate up
        () =>
          currentHeight !== "0px" &&
          favArrowDown &&
          gsap.to("#favArrow", { rotate: 0 }),
        "<"
      );
  };

  // ! shift temp unit between C and F
  const shiftTempUnit = () => {
    if (deg === "˚F") {
      gsap.to(".switchCirc", {
        left: "18px",
        duration: 0.4,
      });
      setDeg(() => {
        setTempUnit("imperial");
        townEntered();
        return "˚C";
      });

      townEntered();
    } else {
      gsap.to(".switchCirc", {
        left: "0px",
        duration: 0.4,
      });
      setDeg(() => {
        setTempUnit("metric");
        townEntered();
        return "˚F";
      });
    }
  };

  // ! favorites dropdown
  const favDropdown = () => {
    const currentHeight = getComputedStyle(favListRef.current).height;

    const tl = gsap.timeline({ defaults: { duration: 0.3 } });
    if (currentHeight === "0px") {
      tl.to("#favArrow", { rotate: 90 })
        .to(".favsList", { height: "auto" }, "<")
        .to(".input", { backgroundColor: "#000000ab" }, "<");
    } else {
      tl.to("#favArrow", { rotate: 0 })
        .to(".favsList", { height: "0px" }, "<")
        .to(".input", { backgroundColor: "#0000002e" }, "<");
    }
  };

  // ! clear local storage
  const clearsessionStorage = () => {
    let result = window.confirm("Clear all favorites?");
    if (result) {
      sessionStorage.clear();
      setStorageState(() => {
        return [];
      });
      setCounter(0);
    }
  };

  return (
    <div className='input'>
      <div className='allInputs'>
        <div className='hiddenInputs' ref={hiddenInputsRef}>
          <div className='shiftTemp'>
            <span className='dropdownTextFormat'>Units</span>
            <div className='currentDeg dropdownTextFormat'>{deg}</div>
            <div className='tempSwitch' onClick={shiftTempUnit}>
              <div className='switchOuter'>
                <div className='switchCirc'></div>
              </div>
            </div>
          </div>
          {/* favorites dropdown  */}
          <div className='favDropdown'>
            {/* button  */}
            <div className='favButton dropdownTextFormat' onClick={favDropdown}>
              <span className='favArrow'>
                <svg
                  id='favArrow'
                  ref={favArrow}
                  xmlns='http://www.w3.org/2000/svg'
                  width='15'
                  height='16'
                  viewBox='0 0 15 16'
                  fill='none'
                >
                  <path d='M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9L1 7ZM14.7071 8.70711C15.0976 8.31658 15.0976 7.68342 14.7071 7.29289L8.34315 0.928932C7.95262 0.538408 7.31946 0.538408 6.92893 0.928932C6.53841 1.31946 6.53841 1.95262 6.92893 2.34315L12.5858 8L6.92893 13.6569C6.53841 14.0474 6.53841 14.6805 6.92893 15.0711C7.31946 15.4616 7.95262 15.4616 8.34315 15.0711L14.7071 8.70711ZM1 9L14 9V7L1 7L1 9Z' />
                </svg>
              </span>
              <span>Favorites</span>
              {/* favs length  */}
              <span className='favNumWrap'>
                <span className='favNum'>{storageState.length}</span>
              </span>
            </div>
            {/* list of FAVS  */}
            <div className='favsList' ref={favListRef}>
              <div>
                {storageState &&
                  storageState.map((e, index) => (
                    <Fav
                      key={index}
                      index={index}
                      data={e}
                      setInputTown={setInputTown}
                      inputTown={inputTown}
                      townEntered={townEntered}
                    />
                  ))}
              </div>
              <div className='favClearAll' onClick={clearsessionStorage}>
                <span className='material-symbols-outlined'>delete</span>
                <span>clear all</span>
              </div>
            </div>
          </div>
        </div>
        <div className='inputDefault'>
          {/* burger menu */}
          <div className='menu' onClick={burgerClicked}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 85 60'
              fill='none'
            >
              <path
                d='M5 5H79.8885'
                // stroke='black'
                strokeWidth='9'
                strokeLinecap='round'
              />
              <path
                d='M5 30H79.8885'
                // stroke='black'
                strokeWidth='9'
                strokeLinecap='round'
              />
              <path
                d='M5 55H79.8885'
                // stroke='black'
                strokeWidth='9'
                strokeLinecap='round'
              />
            </svg>
          </div>
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
    </div>
  );
};
