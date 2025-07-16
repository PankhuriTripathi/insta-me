import React, {useContext, useEffect, useRef, useState} from 'react';
import {Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App';
import M from "materialize-css/dist/js/materialize.min.js";

const Navbar =()=>{
 
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const navigate= useNavigate()
  useEffect(() => {
 
    const slide_menu = document.querySelectorAll(".sidenav")
    M.Sidenav.init(slide_menu,{})
    M.Modal.init(searchModal.current)
   }, [])
  const renderList = ()=>{
    if(state){
      return [
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
          <li key="3"><Link to="/create">CreatePost</Link></li>,
          <li key="4"><Link to="/myfollowingpost">My following Post</Link></li>,
          <li key="5">
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
        <li key="6"><Link to="/signin">Signin</Link></li>,
        <li key="7"><Link to="/signup">Signup</Link></li>
        ]
      }
    }

    const fetchUsers =(query)=>{
      setSearch(query)
      fetch('/search-users',{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          query
        })
      }).then(res=>res.json())
      .then(results=>{
        
        setUserDetails(results.user)
      })
    }
  
    return(

      <>
      <nav>
      <div className="nav-wrapper white">
       <Link to={state?"/":"/signin"} className="brand-logo">Insta-me</Link>
       <a href='#' className='sidenav-trigger' data-target="slide_out"><i className='material-icons'>menu</i></a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
        </ul>
      </div>

      <div id="modal1" className="modal"  ref={searchModal} >
    <div className="modal-content" style={{color:"black"}}>
                <input
                type="text"
                placeholder='search user'
                value={search}
                onChange={(e)=>fetchUsers(e.target.value)}
                />
                 <ul className="collection">
                 {userDetails.map(item=>{
                  return <Link to={item._id!==state._id?"/profile/"+item._id:'/profile'} onClick={()=>{
                    M.Modal.getInstance(searchModal.current).close()
                    setSearch('')
                    setTimeout(()=>{
                     window.location.reload(false);
                     }, 500);
                  }}><li className="collection-item">{item.email}</li></Link>
                 })}
              
             
                </ul>
    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat " onClick={()=>setSearch('')}>Close</button>
    </div>
  </div>

    </nav>

    <ul id="slide_out" className="sidenav" >
            {renderList()}
        </ul>
        </>
            
    );
}

export default Navbar