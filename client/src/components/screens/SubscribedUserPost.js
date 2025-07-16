//change home data to dynamic data. all post amke it as a protected route
//
import React, {useContext, useEffect, useState} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const SubscribedUserPost =()=>{

    const [data, setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    
     const LikePost=(id)=>{
      
        fetch('/like', {
            method:"put",
            headers: {
                "Content-Type":"application/json",
                "authentication":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData= data.map(item=>{
                if(item._id==result._id)//vrecord is updated
                return result
                else
                return item
            })
            setData(newData)
            console.log(result)
        })
    
}

const UnlikePost=(id)=>{
  
    // console.log(state)
     fetch('/unlike', {
         method:"put",
         headers: {
             "Content-Type":"application/json",
             "authentication":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
             
             postId:id
         })
     }).then(res=>res.json())
     .then(result=>{
         const newData= data.map(item=>{
             if(item._id==result._id)//record is updated
             return result
             else //mot updated
             return item
         })
         setData(newData)
         console.log(result)
     })
 
}


const commentPost=(text,id)=>{
  
    // console.log(state)
     fetch('/comment', {
         method:"put",
         headers: {
             "Content-Type":"application/json",
             "authentication":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
             text,
             postId:id
         })
     }).then(res=>res.json())
     .then(result=>{
         const newData= data.map(item=>{
             if(item._id==result._id)//record is updated
             return result
             else //mot updated
             return item
         })
         setData(newData)
         console.log(result)
     })
 
}


    useEffect(()=>{
     fetch('/getsubpost',{
        headers:{//if they are logged in they have token
            "authentication":"Bearer "+localStorage.getItem("jwt")
        }
     }).then(res=>res.json())
     .then(result=>{
  
        setData(result.posts)
     }).catch(err=>{
        console.log(err)
     })   
    },[]) //empty dependency


  const deletePost =(postid)=>{
        fetch(`/deletepost/${postid}`, {
            method:"delete",
            headers:{
                authentication:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !==result._id
            })
            setData(newData)
        })

  }

  const deleteComment =(id)=>{
    fetch('/deletecomment', {
        method:"delete",
        headers: {
            "Content-Type":"application/json",
            "authentication":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
        const newData= data.map(item=>{
            if(item._id==result._id)//record is updated
            return result
            else //mot updated
            return item
        })
        setData(newData)
        console.log(result)
    })

  }

    return(
        <div className='home'>
            {
                data.map(item=>{
                    return (
                        <div className='card home-card' key={item._id}>
                <h5 style={{padding:"7px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id:"/profile/"+state._id}> {item.postedBy.name}</Link> {item.postedBy._id == state._id
                 && <i className="material-icons" style={{float:"right"} }
                onClick={()=>deletePost(item._id)}
                >delete</i>}</h5>
                <div className='card-image'>
                    <img src= { item.photo} />
                </div>
                <div className='card-content'>
                <i className="material-icons" style={{color:"red"}}>favorite</i>
                {
                    item.likes.includes(state._id)?
                    <i className="material-icons" onClick={()=>UnlikePost(item._id)}>thumb_down</i>
                    :
                    <i className="material-icons"  onClick={()=>LikePost(item._id)}>thumb_up</i>
                }
               
                
                <h6>{item.likes.length} likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body} </p>

                    {
                       item.comments.map(record=>{
                        return(
                            <h6 key={record._id}> <span style={{fontWeight:"500"}}> {record.postedBy.name} </span>  {record.text} 
                            {item.postedBy._id == state._id && <i className="material-icons" style={{float:"right"} }
                                   onClick={()=>deleteComment(item._id)} 
                             >delete</i>}</h6>
                        )
                       }) 
                    }
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        commentPost(e.target[0].value, item._id)
                    }}>
                    <input type="text" placeholder='add a comment ' />
                    </form>
                </div>
            </div>

                    )
                })
            }

            
        </div>
    )
}

export default SubscribedUserPost