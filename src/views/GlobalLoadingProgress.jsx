// MUI Imports
import LinearProgress from "@mui/material/LinearProgress";

const GlobalLoadingProgress = (props) => {
  const { loading } = props;

  return (
    <div className={"fixed inset-0 z-[9999] " + (loading ? "block" : "hidden")}>
      <LinearProgress className="w-full bg-transparent" />
    </div>
  );
};

export default GlobalLoadingProgress;
