import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/auth";
import pageApiHelper from "@/utils/pageApiHelper";

// Component Imports
import RolesCreate from "@/views/apps/roles/create";


// expert category options data


export const metadata = {
  title: "Roles - AskValor",
};

const RoleCreateApp = async () => {
  

  return <RolesCreate  />;
};

export default RoleCreateApp;
