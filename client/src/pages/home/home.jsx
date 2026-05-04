import React from "react";
import Topbar from "../../componenets/topbar/Topbar";
import Sidebar from "../../componenets/sidebar/Sidebar";
import Feeds from "../../componenets/feed/Feeds";
import Rightbar from "../../componenets/rightbar/Rightbar";

function Home() {
    return (
        <div className="bg-gray-50/50 min-h-screen">
            <Topbar />
            <div className="flex w-full overflow-hidden max-w-[1600px] mx-auto">
                <Sidebar />
                <div className="flex flex-[8.5] w-full">
                    <Feeds />
                    <Rightbar />
                </div>
            </div>
        </div>
    );
}

export default Home;