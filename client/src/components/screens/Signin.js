import React from 'react'
import {Link, useNavigate } from 'react-router-dom'
import {UserContext} from '../../App'
import { useState, useContext } from 'react'
import M from 'materialize-css'

const Signin =()=>{

const {state, dispatch} = useContext(UserContext)
const navigate= useNavigate()
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
    
    const PostData =()=>{
       if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email", classes:"#d32f2f red darken-2"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                
                password,
                email
            })
        }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html: data.error, classes:"#d32f2f red darken-2"})
                }
                else{
                    //to save the token to local storage
                    localStorage.setItem("jwt", data.token)
                    //stringify is needed as it was a (object-user) but in localstorage we can only store string
                    localStorage.setItem("user", JSON.stringify(data.user))
                      //dispatch takes action creators of type user nd payload data.user , go to our reducer nd our state will updated state
                    dispatch({type:"USER", payload:data.user})
                    M.toast({html: "signed in success", classes:"#00c853 green accent-4" })
                    navigate('/') 
                }
            }).catch(err=>{
                console.log(err);
            })
    }
    
   return(
        <div className="mycard">
            <div class='card auth-card input-field'>
                <h2>Insta-me</h2>
                <input
                type="text"
                placeholder='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                 <input
                type="password"
                placeholder='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                  <button className="btn waves-effect waves-light #1976d2 blue darken-2"
                  onClick={()=>PostData()}>
                       Login
                    </button>
                    <h5>
                        <Link to="/signup">Dont have an account ?</Link>
                    </h5>
                    <h6>
                        <Link to="/reset">Forgot Password ?</Link>
                    </h6>
            </div>
        </div>
    )
}

export default Signin