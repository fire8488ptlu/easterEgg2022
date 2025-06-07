import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {animReducer} from './animReducers'



// reducer 就是任何會觸發 setstate的 分門別類的放進來
const reducer = combineReducers({
    anim : animReducer,

   
})

const middleware= [thunk]

const store = createStore(reducer,composeWithDevTools(applyMiddleware(...middleware)))

export default store