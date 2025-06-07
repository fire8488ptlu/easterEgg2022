import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import Screen1 from './S1Component/Screen1'
import Screen2 from './S2Component/Screen2'
import {useNavigate} from 'react-router-dom';
import {ANIM_RESET} from '../Constants/animConstants'
import './HomeScreen.scss'



// homeScreen 
// Screen1 component 
// Screen2 component 隨便找些爛特效來測試
// 全都要上 redux pass value
// 等全部搞定之後 再navigate到 contentScreen 

// new plugin
// https://webdevelop.pro/blog/createing-svg-animation-lottie
function HomeScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const anim = useSelector(state=>state.anim) // 撈取reduecer的值
    const {Screen1:S1 ,Screen2:S2 ,Screen3:S3 ,S2ToS3Value:S2ToS3} = anim
    //------- 上面的selector = setState那樣 只要有變化馬上就會引響下面的render 不會經過useEffect
    // 不要去引進不相關的state 不然一改變可能也會影響到下面，當然如果本身沒有用到引進了也不會影響什麼，但就是沒必要去宣告


    useEffect(()=>{
        if(S3==true){
            navigate(`/content/${S2ToS3}`)
            dispatch({
                type:ANIM_RESET
            })
        }

    },[ S3,S2ToS3 ])
    // [] 的目標是為了確定那些state變化後 可以進入useEffect裡面去做其他的function
    

    return (
        <>
            {S1==true
                ? <Screen1/>
                : null
            }

            {S2==true
                ? <Screen2/>
                : null
            }
    
        </>
    )
}

export default HomeScreen