import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import ExpertTimeSlot from "@/views/apps/experts/time-slots";

const getExpertWithListData = async (id) => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the categories data
      const result = await pageApiHelper.get(
        `experts/${id}/time-slots`,
        { pageSize: 200 },
        session.accessToken,
      );

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
};

// expert option options data
const getOptionData = async () => {
  // Vars
  const session = await getServerSession(authOptions);

  if (session?.accessToken) {
    try {
      // Fetching the experts data
      const result = await pageApiHelper.get(
        "experts/menu-options",
        { model: "weekDays" },
        session.accessToken,
      );

      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  return null;
};

export const metadata = {
  title: "Expert Time Slot - AskValor",
};

const ExpertTimeSlotApp = async ({ params }) => {
  // Vars
  const { id } = await params;
  const { expert } = await getExpertWithListData(id);

  const result = await getOptionData();
  const weekDays = result?.data.weekDays || [];

  return <ExpertTimeSlot expert={expert} weekDaysDropdown={weekDays} />;
};

export default ExpertTimeSlotApp;
