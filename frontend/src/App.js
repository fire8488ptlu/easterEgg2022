import {BrowserRouter as Router,Route ,Routes} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Home from './Screens/HomeScreen'
import Content from './Screens/ContentScreen'
import './bootstrap.css';
function App() {
  return (
    <Router>
      {/* header */}
  
      <Routes>
        <Route path='/'  element={<Home />}/>
        <Route path='/content/:id' element={<Content/>}  />
        

      </Routes>
      {/* footer */}
    </Router>
  );
}

export default App;
