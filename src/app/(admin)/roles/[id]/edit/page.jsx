// Component Imports
import { getServerSession } from 'next-auth';

import RoleEditList from "@/views/apps/roles/edit";

import { authOptions } from "@/libs/auth";
import pageApiHelper from '@/utils/pageApiHelper';

const getRoleData = async (id) => {

  const session = await getServerSession(authOptions)

  if (session?.accessToken) {
    try {
      // Fetching the experts data
      const result = await pageApiHelper.get(`roles/${id}`, { pageSize: 200 }, session.accessToken);

      //console.log('roles response :',result)


      if (result.success) {
        return result.data;
      }

      return null;
    } catch (error) {
      // console.error('Error fetching experts:', error);

      return null;
    }
  }

  return null;
}

export const metadata = {
  title: "Roles - AskValor",
};

const RoleEditListApp = async ({ params }) => {
  //expert data
 

  const { id } = await params;
  const res = await getRoleData(id);

  
  const roleData = res?.data?.role || {}
  return <RoleEditList listData={roleData} />;
};

export default RoleEditListApp;
