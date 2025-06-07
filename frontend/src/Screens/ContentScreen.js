import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PROXY_SERVER } from "../Constants/proxyConstants";
import Title from "../Components/Title/Title";
import Footer2 from "../Components/Footer2/Footer2";
import Loader from "../Components/Loader/Loader";
import CardSample from "../Components/AnimData/sample.png";
import { Container, Row, Col } from "react-bootstrap";
function ContentScreen() {
  // const navigate = useNavigate()
  const cardId = window.location.href.split(/[/,?]/)[4];
  const [loader, setLoader] = useState(true);
  const ContentOnload = (e) => {
    setLoader(false);
    document.getElementById("ContentScreen").style.visibility = "visible";
  };

  return (
    <>
      {loader == true ? <Loader /> : null}
      <div id="ContentScreen" style={{ visibility: "hidden" }}>
        <section className="container3" onLoad={ContentOnload}>
          <div className="box">
            <img
              className="=blesscard"
              id="blesscard_content"
              src={CardSample}
              alt="'blesscard"
            />
          </div>
        </section>
        <Footer2 />
      </div>
    </>
  );
}

export default ContentScreen;
