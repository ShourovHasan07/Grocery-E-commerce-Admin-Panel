// "use client";

// import React from "react";

// const LoaderIcon = ({ size = '20px' }) => {
//   return (
//     <div
//       className="border-2 border-[#848484] border-t-[#FFB900] rounded-full animate-spin inline-block"
//       style={{
//         width: size,
//         height: size,
//         verticalAlign: "middle",
//       }}
//     />
//   );
// };

// export default LoaderIcon;

"use client";

import React from "react";

const LoaderIcon = ({ size = 12, topColor = "border-t-orange-500" }) => {
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
