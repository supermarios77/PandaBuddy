import React from "react";
import YouTube from "react-youtube";

const YouTubeVideo = ({ videoId, className }: { videoId: string, className: string }) => {
  return (
    <div className="mt-12">
      <YouTube
        videoId={videoId}
        opts={{ width: "100%", height: "500px" }}
        className={className}
      />
    </div>
  );
};

export default YouTubeVideo;