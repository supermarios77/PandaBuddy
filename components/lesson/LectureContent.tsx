import React from "react";
import ReactMarkdown from "react-markdown";

const LectureContent = ({ content }: { content: string }) => {
  return (
    <div className="prose">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default LectureContent;