import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
const Profile =()=>{
  const [mypics, setPics] = useState([])
  const {state,dispatch} = useContext(UserContext)
  const [image,setImage] = useState("")

  useEffect(()=>{
    fetch('/mypost',{
       headers:{
        "authentication":"Bearer "+localStorage.getItem("jwt")
       }
    }).then(res=>res.json())
    .then(result=>{
      
      setPics(result.mypost)
    })
  },[])
  useEffect(()=>{
    if(image){
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
     
   
      fetch('/updatepic',{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "authentication":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          pic:data.url
        })
      }).then(res=>res.json())
      .then(result=>{
        console.log(result)
          
      localStorage.setItem("user", JSON.stringify({...state,pic:result.pic}))
      dispatch({type:"UPDATEPIC", payload:result.pic})
      //window.location.reload()
      })
     
      })
      .catch(err=>{
          console.log(err)
      }) 
    }
  },[image])

  const updatePhoto =(file)=>{
    setImage(file)
   
  }

    return(
      <div style={{maxWidth:"550px", margin:"0px auto"}}>
        <div  style={{
           margin:"18px 0px",
           borderBottom: "1px solid grey",
         }}>
        <div style={{
          font: "message-box",
          display:"flex",
           justifyContent:"space-around",
        }}>
            <div>
                <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                src={state?state.pic:"loading"}

                />
                 
            </div>
                 
            <div>
            <h4>{state?state.name: "loading"}</h4>
            <h5>{state?state.email: "loading"}</h5>
             <div style={{display:"flex", justifyContent:"space-between", width: "112%"}}>
              <h6>{mypics.length} posts</h6>
              <h6>{state?state.followers.length:0} followers</h6>
              <h6>{state?state.following.length:0} following</h6>
             </div>
            </div>
           
        </div>
        <div className="file-field input-field" style={{margin:"10px"}}>
              <div className="btn #1976d2 blue darken-2">
                  <span>Update Pic</span>
            
                  <input type="file"   
                    // if we do console.log on event.target.files we will get an array of imagefiles containing details of 
                    //it like type size..etc.
                  onChange={(e)=>updatePhoto(e.target.files[0])}
                    />
              </div>
                <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
                </div>
        </div>
                    </div>

         <div className="gallery">
         {
          mypics.map(item=>{
            return(
              <img key={item._id} className="item" src={item.photo} alt={item.title} />
            )
          })
         }
        
         </div>


      </div>
    )
}

export default Profile