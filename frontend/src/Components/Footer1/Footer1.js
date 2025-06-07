import React,{useState} from 'react'
import { Container,Row ,Col} from 'react-bootstrap';
import { PROXY_SERVER } from '../../Constants/proxyConstants'
import FbImg from './fb.png'
import LineImg from './line.png'
import CopyImg from './copy.png'
import CopyImg1 from './copy1.png'





function Footer1() {

  const [copyIMG,setCopyIMG] = useState(CopyImg)

  let route = "http://"+window.location.href.split(/[/,?]/)[2]+"/"
  const [copyURL,setCopyURL] = useState(route)

  const FbShare = (e)=>{
    window.open(`http://www.facebook.com/sharer/sharer.php?u=${PROXY_SERVER}`, "_blank")
  }

  const LineShare = (e)=>{
    window.open(`http://line.me/R/msg/text/${PROXY_SERVER}`, "_blank")
  }

  const CopyLink = async(e)=>{

        const range = document.createRange();
        // 將指定元素內容加到 Range 中
        const texts = document.getElementById('copyURL');
        range.selectNode(texts);
        // 取得 Selection 物件
        const selection = window.getSelection();
        // 先清空當前選取範圍
        selection.removeAllRanges();
        // 加入 Range 
        selection.addRange(range);
        
        document.execCommand('copy');
        selection.removeAllRanges();

        setCopyIMG(CopyImg1)
          // alert ("連結已複製!");
  }

  return (
    //imoprt bootstrap system
    // https://www.w3schools.com/css/tryit.asp?filename=trycss_grid_layout_named
    <footer style={{marginLeft:"auto", marginRight:"auto",width:"350px",marginTop:"1.2em"}}>
        <Row style={{paddingRight:"10px",paddingLeft:"10px"}}>
            <Col onClick={FbShare} sm={2} md={2} lg={2} xl={2} xs={2} style={{padding:"1px"}}>
                <img
                  style={{maxWidth:"80%"}}
                  src={FbImg}
                  alt="facebook"
                />
            </Col>
            <Col onClick={LineShare} sm={5} md={5} lg={5} xl={5} xs={5} style={{padding:"1px"}}>
                <img
                  style={{maxWidth:"100%"}}
                  src={LineImg}
                  alt="line"
                />
            </Col>
            <Col onClick={CopyLink} sm={5} md={5} lg={5} xl={5} xs={5} style={{padding:"1px"}}>
                <img
                  style={{maxWidth:"95%"}}
                  src={copyIMG}
                  alt="copy"
                />
            </Col>
        </Row>

        <Row>
            <div className="bch__class"  id="copyright">
                <p>COPYRIGHT©BANNERCHURCH 2022</p>
            </div> 
            <p id="copyURL"style={{opacity:"0"}}>{copyURL}</p>

        </Row>



      </footer>
  )
}

export default Footer1