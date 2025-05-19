// HOC Imports
import GuestOnlyRoute from "@/hocs/GuestOnlyRoute";

const Layout = async (props) => {
  const { children } = props;

  return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
};

export default Layout;
