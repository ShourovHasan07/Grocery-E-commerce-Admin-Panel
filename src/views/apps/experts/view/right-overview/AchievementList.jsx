// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";

import CustomAvatar from "@core/components/mui/Avatar";
import { formattedDate } from "@/utils/formatters";


const AchievementList = ({ expertData }) => {
  console.log(expertData.achievements)

  const getAvatar = (params) => {
    const { avatar, name } = params;

    if (avatar) {
      return <CustomAvatar src={avatar} size={50} />;
    } else {
      return <CustomAvatar size={50}>{getInitials(name)}</CustomAvatar>;
    }
  };

  
return (
    <>
      <Card>
        <CardHeader
          title="Expert Achievements"
          className="pb-1"
        />

        <CardContent>
          <Grid size={{ xs: 12 }}>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2 text-start">ID</th>
                    <th className="border px-4 py-2">Image</th>
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Subtitle</th>
                    <th className="border px-4 py-2">Added At</th>
                  </tr>
                </thead>
                <tbody>
                  {expertData.achievements?.map((achievement, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {getAvatar({
                          avatar: achievement.image,
                          name: achievement.title,
                        })}
                      </td>
                      <td className="border px-4 py-2">{achievement.title}</td>
                      <td className="border px-4 py-2">{achievement.subTitle}</td>
                      <td className="border px-4 py-2">{formattedDate(achievement.pivot.createdAt)}</td>
                    </tr>
                  ))}
                  {(!expertData.achievements || expertData.achievements.length === 0) && (
                    <tr>
                      <td colSpan={3} className="border px-4 py-2 text-center">
                        No achievement found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default AchievementList;
