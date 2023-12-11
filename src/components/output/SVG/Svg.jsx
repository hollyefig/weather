import { Svgset } from "./Svgset";
import { iconData } from "../../../iconData";

export const Svg = ({ weather }) => {
  // get correct icon
  let match;
  iconData.forEach((e) => {
    e.type.forEach((i) => {
      if (i === weather) {
        match = e.icon;
      }
    });
  });

  return (
    <>
      <Svgset />

      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        className='icon'
      >
        <use href={`#${match}`}></use>
      </svg>
    </>
  );
};
