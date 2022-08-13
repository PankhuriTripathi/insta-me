import React, { useState, useContext } from 'react'
import {Link, useNavigate,useParams} from 'react-router-dom'
import M from 'materialize-css'

const Signin =()=>{


    const navigate= useNavigate()
    const [password, setPassword] = useState("")
    const {token} = useParams()
    const PostData =()=>{
       console.log(token)
        fetch("/newpassword",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
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
            }).catch(err=>{
                console.log(err);
            })
    }
    
   return(
        <div className="mycard">
            <div class='card auth-card input-field'>
                <h2>Insta-me</h2>
                
                 <input
                type="password"
                placeholder='enter new password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                  <button className="btn waves-effect waves-light #1976d2 blue darken-2"
                  onClick={()=>PostData()}>
                       Update Password
                    </button>
                   
            </div>
        </div>
    )
}

export default Signin