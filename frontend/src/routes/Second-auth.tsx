import React from "react";
import { useState } from "react";
import { getCookie, setCookie } from "../func/cookieFunc";
import Button from "../component/button/Button";

export function SecondAuth({
  setLogin
}: {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // export function SecondAuth() {
  const [code, setCode] = useState("");

  const onReSend = () => {
    fetch("http://localhost:3000/second-auth/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + getCookie("token")
      }
    });
  };

  const onCodeCheck = () => {
    fetch("http://localhost:3000/second-auth/" + code, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + getCookie("token")
      }
    })
      .then(response => response.json())
      .then(({ matchCode }: { matchCode: boolean }) => {
        if (matchCode) {
          setCookie("isLogin", "1");
          setLogin(true);
        } else {
        }
      });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className="flex justify-evenly items-center">
      <div className="w-[550px]">
        <img src={require("../img/pong.png")} alt="maserati pong" />
      </div>
      <div className="h-[500px] flex flex-col justify-evenly w-[300px]">
        <h1 className="text-4xl">SecondAuth</h1>
        <div className="flex flex-col">
          <p className="text-left text-lg pb-2">2차 인증 코드</p>
          <input
            className="border-2 rounded"
            onChange={onChange}
            value={code}
          />
          <div className="flex justify-between text-sm py-1">
            <p className="text-red-700">코드가 일치하지 않습니다!</p>
            <p className="underline" onClick={onReSend}>
              재전송
            </p>
          </div>
        </div>
        <div>
          <Button tag={"확인"} className={"btn-lg"} onClick={onCodeCheck} />
        </div>
      </div>
    </div>
  );
}
