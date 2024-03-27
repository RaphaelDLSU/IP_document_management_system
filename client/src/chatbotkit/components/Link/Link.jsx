import React from "react";



import "./Link.css";

const Link = ({ url, title }) => {
  return (
    <a
      href={url}
      rel="noopener noreferrer"
      className="url-link"
    >

      <h1 className="url-header">Go to {title}</h1>
    </a>
  );
};

export default Link;
