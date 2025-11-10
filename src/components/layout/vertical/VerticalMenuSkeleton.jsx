"use client";

// MUI Imports
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const VerticalMenuSkeleton = () => {

  return (
    <Box sx={{ padding: '16px' }}>
      {/* Dashboard Item Skeleton */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: '8px 0px' }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width="120px" height="20px" />
      </Box>

      {/* Menu Items Skeleton */}
      {['100px', '120px', '90px', '110px', '95px', '145px', '110px', '95px', '125px'].map((width, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: '8px 0px' }}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={width} height="20px" />
        </Box>
      ))}
    </Box>
  );
};

export default VerticalMenuSkeleton;
