
import {React,useEffect,useState,useContext} from "react";
import { AuthContext } from "../../context/AuthContext"; 
import { Link } from 'react-router-dom';
import './Rightbar.css';
import { Users } from '../../pages/dummyData.js';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import 'react-modern-drawer/dist/index.css';

//here cuser is logined user and user is the general user
axios.defaults.withCredentials = true


const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Friend = ({user}) => {
    return<>
      <Link to={"/profile/"+user._id} style={{ textDecoration:'none',color:'black' }} >
         <div className="profile-friend">
              <img src={user.profilePic?PF+user.profilePic : PF+"person/noAvatar.png"} alt="friend" className="profile-friend-img" />
              <span className="profile-friend-name">{user.username}</span>
        </div>
      </Link>
    </>
}





function Rightbar({user}){

    

   
        

    const ProfileRightbar = ({user}) =>{

        const [friends,setFriends] = useState([])

        const {user:cuser,dispatch} = useContext(AuthContext)
    
        const [isFollowed,setIsFollowed] = useState(false)

        const [prompt,setPrompt] = useState(false)

        const [age,setAge]=useState();
        const [relationship,setRelationship] = useState();
        const [workat,setWorkat] = useState();
       
        const [load,setLoad] = useState(true);
    
        const handleClick = async ()=>{
           try{
            if(isFollowed)
            {
                await axios.put(`/users/${user._id}/unfollow`,{userId : cuser._id})    //here we changing followings remotely
                dispatch({type:"UNFOLLOW",payload : user._id})                      //dispatch triggers the action and action is performed through reducer
            }
            else                                                     //here we are changing followings locally 
            {
                await axios.put(`/users/${user._id}/follow`,{userId : cuser._id})
                dispatch({type:"FOLLOW",payload : user._id})                        //dispatch triggers the action and action is performed through reducer
            }
           }catch(err){
            console.log(err)
           }
           
           
           
           setIsFollowed(!isFollowed)
    
        }


        useEffect(()=>{
            const fetchFriends = async () => {
                try{
                const friend = await axios.get('/users/friends/' + user._id)
                setFriends(friend.data)
                setLoad(false);
                }catch(err)
                {
                    console.log(err)
                    // fetchFriends();
                }
            };
            fetchFriends()
        },[user._id])
        
        useEffect(()=>{
            setIsFollowed(cuser.followings.includes(user._id))
        },[user._id,cuser.followings])

        useEffect(()=>{
            setAge(cuser.age)
            setRelationship(cuser.relationship)
            setWorkat(cuser.workat)
        },[cuser.age,cuser.relationship,cuser.workat])

        const Follow = ()=>{
            return <>
                <button className="rightBarFollowButton" onClick={handleClick}>
                   {isFollowed ? <h3>Unfollow</h3> : <h3>Follow</h3>} 
                </button>
            </>
        }

        const submitInfoHandler = async (e) => {

              e.preventDefault();
              const newPost = {...cuser,

              age:age,
              relationship :relationship,
            workat : workat
               
              }
              
              try{
                await axios.put(`/users/${cuser._id}`,newPost)
                dispatch({type : "INFOAGE", payload : age})
                dispatch({type : "INFOREL", payload : relationship})
                dispatch({type : "INFOWORK", payload : workat})
              }catch(err){
                console.log(err)
              }
              setPrompt(!prompt)
        }


        // const Prompt = () => {                            //Dont use this, as a form it must be render once .....but because of this it will be rendered with every changed value of input
        //     return <div className="promptContainer">
        //             <form onSubmit={submitInfoHandler} >
                    
        //             <input type="text" placeholder="Age" className="data" key={1} value={age} onChange={(e)=>{setAge(e.target.value)}}  />
        //             <input type="text" placeholder="Relationship" className="data" key={2} value={relationship} onChange={(e)=>{setRelationship(e.target.value)}}  />
        //             <input type="text" placeholder="Work at" className="data" value={workat} key={3} onChange={(e)=>{setWorkat(e.target.value)}} />
        //             <button  type="submit">Update</button>
        //             </form>
                    
                    
        //         </div>
                
            
        // }  

        const editInfoHandler = (e) => {
            e.preventDefault();
           setPrompt(!prompt)
        


        }
        
        
        return <div className="rightbar">
        <div className="rightbar-container">
            {cuser._id!==user._id && <Follow /> }
            <div className="rightbar-profile-info">
                <h4 className="title">User Info</h4>
                <div className="infos">
                    <div className="info">
                    <div className="key">Age</div>
                    <div className="value">{cuser._id===user._id ? cuser.age : user.age}</div>
                    </div>
                    <div className="info">
                    <div className="key">Me in a word</div>
                    <div className="value">{cuser._id===user._id ?  cuser.relationship : user.relationship}</div>
                    </div>
                    <div className="info">
                    <div className="key">Work At</div>
                    <div className="value">{cuser._id===user._id ? cuser.workat : user.workat}</div>
                    </div>
                </div>
                {user._id === cuser._id && (<button className="editInfoBtn" onClick={editInfoHandler} >
                    Edit Info
                </button>)}
                {prompt && (
                <div
                >
                    <form onSubmit={submitInfoHandler} className="promptContainer" >
                    
                    <input type="text" placeholder="Age" className="data" key={1} value={age} onChange={(e)=>{setAge(e.target.value)}}  />
                    <input type="text" placeholder="Me in a word" className="data" key={2} value={relationship} onChange={(e)=>{setRelationship(e.target.value)}}  />
                    <input type="text" placeholder="Work at" className="data" value={workat} key={3} onChange={(e)=>{setWorkat(e.target.value)}} />
                    <button  type="submit" className="subtn" >Update</button>
                    </form>
                    
                    
                </div>
                )}
            </div>
            
            <h4 className="title">Followings</h4>
            <div className="rightbar-profile-friends">
            
            {/* {user.followers.map(u=>{
                return <Friend key={u} user={Users.filter(t=>{t.id===u})[0]} />
             })}  */}
             {load ? <CircularProgress style={{color : 'brown',display : 'block',margin : 'auto',padding : '50px',fontSize : '5px'}} /> :
                friends.map(friend=>{
                    return <Friend key={friend._id} user={friend} />
                })
             }
              
            </div>
            
            
            
        </div>
     </div>
    
    
    }
    
    const [joke,setJoke] = useState();
        useEffect(()=>{ const callJoke = async ()=>{
            const data=await axios.get('https://icanhazdadjoke.com/',{headers : {
                Accept: "application/json",
                'Access-Control-Allow-Origin' : "*"
            }});
            setJoke(data.data.joke);
            console.log(data);
        }
        callJoke();
    }
        ,[])
    
    const HomeRightbar = ({Users}) => {
        

        

        return <div className="rightbar">
        <div className="rightbar-container">
            <div className="rightbar-Ad">
              <img src="/assets/ad.png" alt="batman" className="batman" />
            </div>
            <h4 className="online">Joke for You</h4>
            <div className="online-friends">
                
                {/* <div className="friends">
                   {Users.map((u)=>{
                    return <Online key={u.id} user={u}/>
                   })}
                    
                </div> */}
                <div className="joke-container" >
                   <span>
                    {joke}
                   </span>
                </div>
            </div>
        </div>
    </div>
    
    
    }

    return user?<ProfileRightbar user={user} />:<HomeRightbar Users={Users}/> 
}

export default Rightbar;