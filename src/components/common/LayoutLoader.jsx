"use client";

// MUI Imports
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress'

const LayoutLoader = () => {

  return (
    <Box sx={{
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 175px)',
      width: '100%'
    }}>
      {/* Dashboard Item Skeleton */}
      <div className='flex gap-4'>
        <CircularProgress color='success' />
        <CircularProgress color='warning' />
        <CircularProgress color='info' />
      </div>
    </Box>
  );
};

export default LayoutLoader;
