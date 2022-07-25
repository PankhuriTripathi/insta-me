import React from "react"
import { createContext, useEffect, useReducer, useContext } from "react" // as we have to link our initial state and reducer, same as usestate 
// whenever our state change component will re render , used with context
import Navbar from "./components/Navbar.js"
import './App.css'
import {BrowserRouter,Routes,Route, useNavigate} from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPost from "./components/screens/SubscribedUserPost.js"



export const UserContext = createContext()

const Routing = ()=>{

const navigate = useNavigate()
//app.js is tthe first component loaded in application , so we pass an empty array in useeffect as i want it to run only for the first
//time when component mounts. 
const {state, dispatch}= useContext(UserContext)

useEffect(()=>{
  const user = JSON.parse(localStorage.getItem("user"))
  if(user){
    dispatch({type:"USER", payload:user})

   
  }else{
    navigate('/signin')
  }
},[])

return (
  <Routes>
  <Route path='/'element={<Home />} />
 
  <Route exact path='/profile' element ={<Profile />} />
  
  
  <Route path='/signin' element={<Signin />} />
  
  <Route path='/signup' element={ <Signup />} />

  <Route path='/create' element={ <CreatePost/>} />

  <Route path='/profile/:userid' element={ <UserProfile/>} />

  <Route path='/myfollowingpost' element={ <SubscribedUserPost/>} />

  </Routes>
)
}//routing end




function App() {

const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
   
  );
}

export default App;
