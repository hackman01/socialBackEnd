import React from "react";
import Topbar from "../../componenets/topbar/Topbar";
import Sidebar from "../../componenets/sidebar/Sidebar";
import Feeds from "../../componenets/feed/Feeds";
import Rightbar from "../../componenets/rightbar/Rightbar";
import './home.css';



function Home()
{
    return <>
        <Topbar />
        <div className="container">
        <Sidebar />
        <div className="merged-container">
        <Feeds />
        <Rightbar />
        </div>
        </div>
    </>
}

export default Home;