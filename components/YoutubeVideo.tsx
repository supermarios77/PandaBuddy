import React from "react";
import YouTube from "react-youtube";

const YouTubeVideo = ({ videoId }: { videoId: string }) => {
  return (
    <div className="mt-12">
      <YouTube
        videoId={videoId}
        opts={{ width: "100%", height: "500px" }}
      />
    </div>
  );
};

export default YouTubeVideo;