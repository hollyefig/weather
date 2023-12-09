export const Input = ({ setInputTown, townEntered }) => {
  return (
    <div>
      {/* possibly address-level2  */}
      <input
        type='text'
        autoComplete='address-level2'
        onInput={(e) => setInputTown(e.target.value)}
        className='inputTown'
        placeholder='city / town'
      />

      <button type='button' className='btnTown' onClick={townEntered}>
        Enter
      </button>
    </div>
  );
};
