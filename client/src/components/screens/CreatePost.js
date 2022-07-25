import React from "react";
import { useState, useEffect } from "react"; //updating state asunchronous takes a little time , to make reqquest to node js server
//only when state of setUrl changes, so for that we use useEffect hook
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css'



const CreatePost= ()=>{
    const navigate= useNavigate()
const [title, setTitle] = useState('')
const [body, setBody] = useState('')
const [image, setImage] = useState('')
const [url, setUrl] = useState('')

useEffect(()=>{
    if(url){
     //postinng to our backend server
    fetch("/createpost",{
        method:"post",
        headers:{
            "Content-Type":"application/json",
            "authentication":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
         title,
         body,
         url
        })
    }).then(res=>res.json())
        .then(data=>{
       
            if(data.error){
                M.toast({html: data.error, classes:"#d32f2f red darken-2"})
            }
            else{
                M.toast({html: "Created post successfully", classes:"#00c853 green accent-4" })
                navigate('/') 
            }
        }).catch(err=>{
            console.log(err);
        })
    }
},[url])

const postDetails = ()=>{
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





    return (
        <div className="card input-filed"
        style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding: "20px",
            textAlign: "center" //to center the button
        }}
        >
        
            <input type="text" placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)} />
            <input type="text" placeholder="body" 
                value={body}
            onChange={(e)=>setBody(e.target.value)}
            />
        <div className="file-field input-field">
              <div className="btn #1976d2 blue darken-2">
                  <span>Upload image</span>
            
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
        onClick={()=>postDetails()}
        >
                       Submit post
                    </button>

        </div>
    )
}

export default CreatePost