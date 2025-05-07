import React from "react";
import TopCharts from "../../components/TopCharts";
import MusicPlayer from "../../components/MusicPlayer";

function Dashboard() {
  return (
    <div className="flex flex-col gap-[4vh]">
      <TopCharts />
      <MusicPlayer />
    </div>
  );
}

export default Dashboard;
