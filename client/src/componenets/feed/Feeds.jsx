import React from "react";
import {useState, useEffect, useContext} from "react";
import axios from '../../utils/axios';
import Post from './Post.jsx';
import Feed from './Feed.jsx';
import { CircularProgress } from "@material-ui/core";
import {AuthContext} from '../../context/AuthContext';


function Feeds({cuser}){
  
    const {user} = useContext(AuthContext)
    const [load,setLoad] = useState(true);
    const [posts,setPosts] = useState([]);
    const [postRender,setPostRender] = useState(0)

    
    useEffect(()=>{
       
     const fetchPosts = async ()=>{
        try{
        const res = cuser ? await axios.get("/api/posts/"+cuser._id) : await axios.get("/api/posts/timeline/"+user._id);
        setPosts(res.data.sort((p1,p2)=>{
            return new Date(p2.createdAt) - new Date(p1.createdAt)
        }));
        setLoad(false)
    }
    catch(err){
        // fetchPosts();
        console.log(err)
    }
     }
     fetchPosts();
},[cuser,user._id,postRender]);

    
    return <div className="flex-[6] lg:flex-[5] min-h-[calc(100vh-64px)] pb-20">
        <div className="mt-4 p-2 md:p-4 max-w-3xl mx-auto">
        {cuser? cuser._id===user._id && <Post reRender={setPostRender} /> : <Post reRender={setPostRender} />}
       {load ? <div className="flex justify-center mt-12"><CircularProgress style={{color : '#ac300a'}} /></div>  : posts.map((p)=>{
        return <Feed key={p._id} post={p} setPostRender={setPostRender} />
        
       })}
       
       
       
        </div>
    </div>
}

export default Feeds;
