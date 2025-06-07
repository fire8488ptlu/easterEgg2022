import React from 'react'
import Logo from './logo.png'
import TitlePng from './title.png'
// import { PROXY_SERVER } from '../../Constants/proxyConstants'
function Title() {
  return (
    <header className="title1" >
        <div className="title1__box">
        <div className="title1__logobox">
            <img className="title1__img" src={Logo} alt="復活節" />
            {/* 不要用src的方法因為載入會很慢!!! 用import的 */}
            {/* <img className="title1__img1" src={`${PROXY_SERVER}/Component/title.png`} alt="復活節" /> */}
        </div>

        <div className="title1__logobox">
            {/* <img className="title1__img" src={`${PROXY_SERVER}/Component/logo.png`} alt="復活節" /> */}

            <img className="title1__img1" src={TitlePng} alt="復活節" />
        </div>


        </div>
    </header>
  )
}

export default Title