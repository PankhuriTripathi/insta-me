import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import { useParams } from 'react-router-dom'

const Profile =()=>{
  const [userProfile, setProfile] = useState(null)
 
  const {state,dispatch} = useContext(UserContext)
  const {userid} =useParams()
  
  const [showFollow, setShowFollow] =useState(state?!state.following.includes(userid):true)


  useEffect(()=>{
    fetch(`/user/${userid}`,{
       headers:{
        "authentication":"Bearer "+localStorage.getItem("jwt")
       }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
      setProfile(result)
    })
  },[])

  const followUser =()=>{
    fetch("/follow",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "authentication":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            followid:userid
        })
    }).then(res=>res.json())
    .then(data=>{
        dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState)=>{
            return{
                ...prevState,
                user:{
                  ...prevState.user,
                  followers:[...prevState.user.followers, data._id]
                }
            }
        })
        console.log(data)
        setShowFollow(false)
    })
  }


  const unfollowUser =()=>{
    fetch("/unfollow",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "authentication":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            unfollowid:userid
        })
    }).then(res=>res.json())
    .then(data=>{
        dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState)=>{
          const newFollower= prevState.user.followers.filter(item=>item!=data._id)
            return{
                ...prevState,
                user:{
                  ...prevState.user,
                  followers:newFollower
                }
            }
        })
        setShowFollow(true)
        console.log(data)
        
    })
  }


    return(
        <>
        {
            userProfile?
            <div style={{maxWidth:"550px", margin:"0px auto"}}>

<div style={{
  display:"flex",
   justifyContent:"space-around",
   margin:"18px 0px",
   borderBottom: "1px solid grey"
}}>
    <div>
        <img style={{width:"154px", height:"160px", borderRadius:"80px"}}
        src={userProfile.user.pic} />
    </div>

    <div>
    <h4>{userProfile.user.name}</h4>
    <h4>{userProfile.user.email}</h4>

     <div style={{display:"flex", justifyContent:"space-between", width: "80%"}}>
      <h6>{userProfile.posts.length} posts</h6>
      <h6>{userProfile.user.followers.length} followers</h6>
      <h6>{userProfile.user.following.length} following</h6>
     </div>
    </div>
   
</div>

{showFollow?<button style={{margin:"10px"}} className="btn waves-effect waves-light #1976d2 blue darken-2"
              //calling post data
                  onClick={()=>followUser()}
                  >
                       Follow
                    </button>
                    :
                    <button style={{margin:"8px"}} className="btn waves-effect waves-light #1976d2 blue darken-2"
              //calling post data
                  onClick={()=>unfollowUser()}
                  >
                       UnFollow
                    </button>
                     } 

                    
                    
 <div className="gallery">
 {
  userProfile.posts.map(item=>{
    return(
      <img key={item._id} className="item" src={item.photo} alt={item.title} />
    )
  })
 }

 </div>


</div>
             :
             <h2>loading...</h2> 
        }
     
      </>
    )
}

export default Profile