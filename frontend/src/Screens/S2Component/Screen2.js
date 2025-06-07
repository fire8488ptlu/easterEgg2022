import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "@lottiefiles/lottie-player";
import { PROXY_SERVER } from "../../Constants/proxyConstants";
import { ANIM_S2_TO_S3 } from "../../Constants/animConstants";
import loadingAnim from "../../Components/AnimData/loading.mp4";
import { Component } from "react";
function Screen2() {
  const dispatch = useDispatch();
  //-------- useSelector is before useEffect----
  const anim = useSelector((state) => state.anim); // 撈取reduecer的值
  const { S1ToS2Value: S1ToS2 } = anim;
  // get S1ToS2value and render(dom,funcion) then useEffect !!!

  // everything is render and function load then trigger useEffect
  // 也是可以從這裡轉到s3 但就是統一重homeScreen去轉 這裡去處發render 後的 addEventListner就好
  useEffect(() => {
    S2ToS3dispatch();
  }, []);
  // only execute once is enough

  // before render set css
  document.body.classList.add("animate_background");
  // document.body.style.background = "#C9E6EB"
  //document.body.style.setProperty("background", "blue", "important");

  const S2ToS3dispatch = () => {
    // addEventListener "complete" is for lottie  ended
    document.getElementById(`easterAnim`).addEventListener("ended", () => {
      let num = getRandom(1, 20);
      document.body.classList.remove("animate_background");

      // console.log(num)
      dispatch({
        type: ANIM_S2_TO_S3,
        data: num,
      });
    });
  };

  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // get the value from S1 and animate over then dispatch
  // check the animate is over and dispatch the random
  return (
    <>
      <section
        className="container2"
        id="3"
        style={{ display: "flex", paddingTop: "0rem" }}
      >
        <video id="easterAnim" autoPlay muted playsInline>
          <source src={`${loadingAnim}`} type="video/mp4" />
        </video>
        {/* 
             <lottie-player
                id={"easterAnim"}
                autoplay
                mode={"normal"}

                speed = {"3"}
                src={`${PROXY_SERVER}/LottieAnim/EasterEgg9.json`}
                style={{width: "320px"}}
              >
            </lottie-player> */}
      </section>
    </>
  );
}

export default Screen2;
