// MUI Imports
import LinearProgress from "@mui/material/LinearProgress";

const LoadingProgress = () => {
  return (
    <div className="fixed inset-0 z-[9999]">
      <LinearProgress className="w-full bg-transparent" />
    </div>
  );
};

export default LoadingProgress;
