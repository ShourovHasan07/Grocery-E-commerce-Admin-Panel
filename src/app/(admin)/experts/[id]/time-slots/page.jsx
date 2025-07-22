import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";


// Component Imports
import ExpertTimeSlot from "@/views/apps/experts/time-slots";


const getExpertData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions)

  if (session.accessToken) {
    try {
      // Fetching the categories data
    const result = await pageApiHelper.get(`experts/${id}/time-slots`, { pageSize: 200 }, session.accessToken);

  

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      //console.error('Error fetching categories:', error);

      return null;
    }
  }

  return null;
}


export const metadata = {
  title: "Expert Time Slot - AskValor",
};

const ExpertTimeSlotApp = async ({ params }) => {
  // Vars
  const { id } = await params;
  const {data} = await getExpertData(id);


  return <ExpertTimeSlot expertData={data} />;
};

export default ExpertTimeSlotApp;
