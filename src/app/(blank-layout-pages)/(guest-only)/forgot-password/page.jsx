// Component Imports
import ForgotPassword from "@views/ForgotPassword";

// Server Action Imports
import { getServerMode } from "@core/utils/serverHelpers";
import themeConfig from "@configs/themeConfig";

export const metadata = {
  title: `${themeConfig.templateName} - Forgot Password`,
  description: "Forgotten Password to your account",
};

const ForgotPasswordPage = async () => {
  // Vars
  const mode = await getServerMode();

  return <ForgotPassword mode={mode} />;
};

export default ForgotPasswordPage;
