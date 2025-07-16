import React from 'react'
import {Link, useNavigate } from 'react-router-dom'

import { useState, useContext } from 'react'
import M from 'materialize-css'

const Reset =()=>{



    const navigate= useNavigate()
  
    const [email, setEmail] = useState("")

    
    const PostData =()=>{
        //fetch to make a network request, has second argument-object which contain method, headers, body-which we need to stringify
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email", classes:"#d32f2f red darken-2"})
            return
        }
        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
            email
            })
        }).then(res=>res.json())
            .then(data=>{
           
                if(data.error){
                    M.toast({html: data.error, classes:"#d32f2f red darken-2"})
                }
                else{
                    M.toast({html: data.message, classes:"#00c853 green accent-4" })
                    navigate('/signin') 
                }
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
           
                  <button className="btn waves-effect waves-light #1976d2 blue darken-2"
                  onClick={()=>PostData()}>
                       reset password
                    </button>
                   
            </div>
        </div>
    )
}

export default Reset