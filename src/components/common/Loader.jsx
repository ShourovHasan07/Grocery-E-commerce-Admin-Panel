"use client";

import React from "react";

const LoaderIcon = ({ size = 18, topColor = "border-t-secondary" }) => {
  return (
    <div
      className={`border-2 border-gray-300 ${topColor} rounded-full animate-spin inline-block`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        verticalAlign: "middle",
      }}
    ></div>
  );
};

export default LoaderIcon;
