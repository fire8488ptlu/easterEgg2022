import React from 'react'
import { Container,Row ,Col} from 'react-bootstrap';
import { PROXY_SERVER } from '../../Constants/proxyConstants'
import {useNavigate} from 'react-router-dom';
import FbImg from './fb.png'
import LineImg from './line.png'
import AgainImg from './again.png'



function Footer2() {

  const navigate = useNavigate()
  const id = window.location.href.split(/[/,?]/)[4]

  const FbShare = (e)=>{
      window.open(`http://www.facebook.com/sharer/sharer.php?u=${PROXY_SERVER}/content/${id}`, "_blank")

  }

  const LineShare = (e)=>{
      window.open(`http://line.me/R/msg/text/${PROXY_SERVER}/content/${id}`, "_blank")
  }

  const Again = (e)=>{
    navigate(`/`)
  }





  return (
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
            <Col onClick={Again} sm={5} md={5} lg={5} xl={5} xs={5} style={{padding:"1px"}}>
                <img
                  style={{maxWidth:"100%"}}
                  src={AgainImg}
                  alt="again"
                />
            </Col>
        </Row>

        <Row>
            <div className="bch__class"  id="copyright">
                <p>COPYRIGHT©BANNERCHURCH 2022</p>
            </div> 
        </Row>
    </footer>
  )
}

export default Footer2