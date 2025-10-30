"use client";

// MUI Imports
import Skeleton from "@mui/material/Skeleton";

const DailyProgressSkeleton = () => {
  return (
    <div style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '8px', padding: '20px 0' }}>
      {/* Generate 7 bars for 7 days with predictable heights */}
      {[190, 120, 110, 250, 210, 170, 130].map((height, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={height}
            sx={{
              borderRadius: '6px 6px 0 0',
              maxWidth: '20px',
              marginBottom: '8px'
            }}
          />
          <Skeleton variant="text" width="20px" height="10px" />
        </div>
      ))}
    </div>
  );
};

export default DailyProgressSkeleton;
