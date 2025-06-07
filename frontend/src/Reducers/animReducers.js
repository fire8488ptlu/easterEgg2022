import {
    ANIM_S1_TO_S2,
    ANIM_S2_TO_S3,
    ANIM_RESET,
} from '../Constants/animConstants'

// state 是預設值
export const animReducer = (state={}, action)=>{

    switch(action.type){
    // 在這裡已經宣告了三個變數 loading products error

        case ANIM_S2_TO_S3:
            return {Screen1:false ,Screen2:false , Screen3:true , S2ToS3Value:action.data}
        
        case ANIM_S1_TO_S2:
            return {Screen1:false ,Screen2:true , S1ToS2Value:action.data}

        case ANIM_RESET:
            return {Screen1:true ,Screen2:false }

        default:
            return {Screen1:true ,Screen2:false }

    }
}
