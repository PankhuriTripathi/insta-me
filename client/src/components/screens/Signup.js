import React, { useEffect } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import M from 'materialize-css'

const Signup =()=>{
const navigate= useNavigate()
const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [image,setImage] = useState("")
const [url,setUrl] = useState(undefined)

useEffect(()=>{
     if(url){
        uploadFields()
     }
},[url])
const uploadPic = ()=>{

        const data = new FormData()
        data.append("file", image)
        // we gave insta-clone name to cloudinary
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "jjkaisen")
        //make ntwk request
       //CLOUDINARY_URL=cloudinary://615531475567582:eSyQuCMUzXFC7tPswyE8_Zj5ooY@jjkaisen
      //uploading image to cloudinary
         fetch("https://api.cloudinary.com/v1_1/jjkaisen/image/upload", {
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
        setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        }) 
}

const uploadFields =()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "Invalid Email", classes:"#d32f2f red darken-2"})
        return
    }
    fetch("/signup",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name,
            password,
            email,
            pic:url
        })
    }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#d32f2f red darken-2"})
            }
            else{
                M.toast({html: data.message, classes:"#00c853 green accent-4" })
                navigate('/signin')  //to direct the user to login page so that he coulg login or navigate to login screen
            }
        }).catch(err=>{
            console.log(err);
        })
}

const PostData =()=>{
    //fetch to make a network request, has second argument-object which contain method, headers, body-which we need to stringify
    if(image){
        uploadPic()
    }
    else{
        uploadFields()
    }

    
}


    return(
        <div className="mycard">
            <div class='card auth-card input-field'>
                <h2>Insta-me</h2>
                <input
                type="text"
                placeholder='name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <input
                type="text"
                placeholder='email'
                value={email}
                //when input elment triggers the function that is stored in onChange, it also passes over an object, and that object
                //corresponds to the event that triigered the onChange.
                //e.target.value=  //target-elemrnt that trigger this event //value,placeholder,type-i.e.get hold of the placeholder
                //of the element that trigger the event..
                onChange={(e)=>setEmail(e.target.value)}
                />
                 <input
                type="password"
                placeholder='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                  <div className="file-field input-field">
              <div className="btn #1976d2 blue darken-2">
                  <span>Upload Profile Pic</span>
            
                  <input type="file"   
                    // if we do console.log on event.target.files we will get an array of imagefiles containing details of 
                    //it like type size..etc.
                  onChange={(e)=>setImage(e.target.files[0])}
                    />
              </div>
                <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
                </div>
        </div>
                  <button className="btn waves-effect waves-light #1976d2 blue darken-2"
              //calling post data
                  onClick={()=>PostData()}
                  >
                       Signup
                    </button>
                    <h5>
                        <Link to="/signin">Already have an account ?</Link>
                    </h5>
            </div>
        </div>
    )
}

export default Signup

//cors error: as our react app is running on localhost 300 while our server running on 5000 so our requesrtt get blocked by cors policy.
//to solve-install cors npm package and do AudioParamMap.use(cors()), another option / better is proxy. add proxy to package.json which
//forward our request to localhost 5000 automatically, we basically fool our react as internally our request is geeting forwarded to localhost 5000
// this what proxy it forwards the request to any domain we want

//toast=materialize css download, toast is used to display beautiful pop ups