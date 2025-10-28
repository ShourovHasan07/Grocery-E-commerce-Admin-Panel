// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

// Components Imports
import OptionMenu from "@core/components/option-menu";

// Vars
const data = [
  {
    title: "Legal Compliance",
    progress: 54,
    progressColor: "error",
    img: "/images/logos/laravel.png",
  },
  {
    title: "Growth Hacking",
    progress: 85,
    progressColor: "primary",
    img: "/images/logos/figma.png",
  },
  {
    title: "Business Model",
    progress: 64,
    progressColor: "success",
    img: "/images/logos/vue.png",
  },
  {
    title: "MVP Strategy",
    progress: 40,
    progressColor: "info",
    img: "/images/logos/react.png",
  }
];

const ActiveProjects = () => {
  return (
    <Card>
      <CardHeader
        title="Active Projects"
        subheader="Average 72% completed"
        action={<OptionMenu options={["Refresh", "Update", "Share"]} />}
      />
      <CardContent className="flex flex-col gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <img src={item.img} alt={item.title} width={32} />
            <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full">
              <div className="flex flex-col">
                <Typography className="font-medium" color="text.primary">
                  {item.title}
                </Typography>
              </div>
              <div className="flex justify-between items-center is-32">
                <LinearProgress
                  value={item.progress}
                  variant="determinate"
                  color={item.progressColor}
                  className="min-bs-2 is-20"
                />
                <Typography color="text.disabled">{`${item.progress}%`}</Typography>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActiveProjects;
