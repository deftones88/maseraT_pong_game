import React from "react";
interface PopUpChkProps {
  text: string;
}

function PopUpCheck({ text }: PopUpChkProps): JSX.Element {
  return (
    <div className="wrap bg-blue-500 h-[80px] flex flex-col justify-between mb-4">
      <span className="font-main text-lg font-semibold flex justify-center">
        {text}
      </span>
      <div className="btn__wrap bg-yellow-400 flex justify-evenly">
        <button className="bg-button font-main text-sm text-white rounded w-[60px] h-[28px]">
          확인
        </button>
        <button className="bg-button font-main text-sm text-white rounded w-[60px] h-[28px]">
          취소
        </button>
      </div>
    </div>
  );
}

export default PopUpCheck;