// Component Imports
import Login from "@views/Login";
import themeConfig from "@configs/themeConfig";

// Server Action Imports
import { getServerMode } from "@core/utils/serverHelpers";

export const metadata = {
  title: `${themeConfig.templateName} - Login`,
  description: "Login to your account",
};

const LoginPage = async () => {
  // Vars
  const mode = await getServerMode();

  return <Login mode={mode} />;
};

export default LoginPage;
