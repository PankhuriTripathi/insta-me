import React, {useContext, useEffect} from 'react';
import {Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App';
import M from "materialize-css/dist/js/materialize.min.js";

const Navbar =()=>{

  const {state, dispatch} = useContext(UserContext)
  const navigate= useNavigate()
  useEffect(() => {
 
    const slide_menu = document.querySelectorAll(".sidenav")
    M.Sidenav.init(slide_menu,{})
   }, [])
  const renderList = ()=>{
    if(state){
      return [
        <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/create">CreatePost</Link></li>,
          <li><Link to="/myfollowingpost">My following Post</Link></li>,
          <li>
             <button className="btn #f44336 red"
                  onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    navigate('/signin')
                  }}>
                       Logout
                    </button>
          </li>
      ]
    }else{
        return[
        <li><Link to="/signin">Signin</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
        ]
      }
    }
  
    return(

      <>
      <nav>
      <div className="nav-wrapper white">
       <Link to={state?"/":"/signin"} className="brand-logo">Instagram</Link>
       <a href='#' className='sidenav-trigger' data-target="slide_out"><i className='material-icons'>menu</i></a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
        </ul>
      </div>
    </nav>

    <ul id="slide_out" className="sidenav" >
            {renderList()}
        </ul>
        </>
            
    );
}

export default Navbar