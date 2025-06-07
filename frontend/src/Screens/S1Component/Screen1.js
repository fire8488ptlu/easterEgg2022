import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import { Container,Row ,Col} from 'react-bootstrap';
import {ANIM_S1_TO_S2} from '../../Constants/animConstants'
import Title from '../../Components/Title/Title'
import Footer1 from '../../Components/Footer1/Footer1'
import Loader from '../../Components/Loader/Loader'
import Egg1 from './CoverEgg/egg-1.png'
import Egg2 from './CoverEgg/egg-2.png'
import Egg3 from './CoverEgg/egg-3.png'
import Egg4 from './CoverEgg/egg-4.png'
import Egg5 from './CoverEgg/egg-5.png'
import Egg6 from './CoverEgg/egg-6.png'
import Egg7 from './CoverEgg/egg-7.png'
import Egg8 from './CoverEgg/egg-8.png'
import Start from './CoverEgg/start.png'

function Screen1() {


    const dispatch = useDispatch()
    const [loader,setLoader] = useState(true)

    const total_items = 8;
    const minimum_jumps = 30; // 超過這數字開始進入抽獎
    let current_index = -1;
    let jumps = 0;
    let speed = 30;
    let timer = 0;
    let prize = -1;  
    let start_temp = true;

    // const viewportmeta = document.querySelector('meta[name=viewport]');
    // console.log(viewportmeta)

    const S1_S2Dispatch = (e)=>{
       start_temp = true; //start_temp
       //--------------------
      //  console.log(current_index)
       dispatch({
        type:ANIM_S1_TO_S2,
        data: current_index
       })

       // dispatch the value to S2
    }

    const generatePrizeNumber=(e)=> {
        return Math.floor(Math.random() * total_items);
      }

    const runCircle=(e) =>{
        if(document.querySelector(`div[data-order="${current_index}"]`)){
            document.querySelector(`div[data-order="${current_index}"]`).className = "square"
        }
        current_index += 1;
        if (current_index > total_items - 1) {
             current_index = 0;
        }
        if(document.querySelector(`div[data-order="${current_index}"]`)){
            document.querySelector(`div[data-order="${current_index}"]`).className += " is-active";
        }
    }

    const  controllSpeed=(e) =>{
        jumps += 1;
        runCircle();
        // finish
        if (jumps > minimum_jumps + 10 && prize === current_index) {

    
          clearTimeout(timer);

          prize = -1;
          jumps = 0;

          setTimeout(()=>{
            S1_S2Dispatch()
          },1500)


        // notfinish
        } else {
          if (jumps < minimum_jumps) {
            speed -= 5;
          } else if (jumps === minimum_jumps) {
            const random_number = generatePrizeNumber();
            prize = random_number;
          } else {
            if (jumps > minimum_jumps + 10 && prize === current_index + 1) {
              speed += 600;
            } else {
              speed += 20; // 減速
            }
          }
          if (speed < 40) {
            speed = 40;
          }
          timer = setTimeout(controllSpeed, speed);
        }
      }

    const init =  (e)=> {
        jumps = 0;
        speed = 100;
        prize = -1;
        controllSpeed();

    };
      
    const StartClick = (e)=>{
        if (start_temp) {
            start_temp = false;
            init();
        }
    }

    const CardOnLoad=(e)=>{
        setLoader(false)
        document.getElementById("HomeScreen").style.visibility="visible"
    }


    return (
      < >
        {loader==true
          ? <Loader/>
          : null
        }
    
        <div id="HomeScreen" style={{visibility:"hidden"}}>
          <Title/>
          <section className="container_1" id="1" onLoad={CardOnLoad}>
                  <div className="square" data-order="0">
                      <img className="square__content" src={Egg1} alt="EggLogo" />
                  </div>

                  <div className="square" data-order="1">
                      <img className="square__content" src={Egg2} alt="EggLogo" />
                  </div>

                  <div className="square" data-order="2">
                      <img className="square__content" src={Egg3} alt="EggLogo" />
                  </div>

                  <div className="square" data-order="7">
                      <img className="square__content" src={Egg8} alt="EggLogo" />
                  </div>

                  <div onClick={StartClick} className="square square__start-btn" id="js-start">
                      <img className="nav__icon3" src={Start} />
                  </div>

                  <div className="square" data-order="3">
                      <img className="square__content" src={Egg4} alt="EggLogo" />
                  </div>

                  <div className="square" data-order="6">
                      <img className="square__content" src={Egg7} alt="EggLogo" />
                  </div>

                  <div className="square" data-order="5">
                      <img className="square__content" src={Egg6} alt="EggLogo" />
                  </div>

                  <div className="square" data-order="4">
                      <img className="square__content" src={Egg5} alt="EggLogo" />
                  </div>
          </section>
          <Footer1/>

         </div>
      </>
    )
}

export default Screen1