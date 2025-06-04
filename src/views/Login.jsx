"use client";

// React Imports
import { useCallback, useState } from "react";

// Next Imports
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// MUI Imports
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";

// Third-party Imports
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import classnames from "classnames";

// Component Imports
import Logo from "@components/layout/shared/Logo";
import CustomTextField from "@core/components/mui/TextField";
import GlobalLoadingProgress from "./GlobalLoadingProgress";

// Config Imports
import themeConfig from "@configs/themeConfig";

// Hook Imports
import { useImageVariant } from "@core/hooks/useImageVariant";
import { useSettings } from "@core/hooks/useSettings";

// Styled Custom Components
const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  blockSize: "auto",
  maxBlockSize: 680,
  maxInlineSize: "100%",
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxBlockSize: 450,
  },
}));

const MaskImg = styled("img")({
  blockSize: "auto",
  maxBlockSize: 355,
  inlineSize: "100%",
  position: "absolute",
  insetBlockEnd: 0,
  zIndex: -1,
});

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is invalid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

const Login = ({ mode }) => {
  // States
  const [showLoading, setShowLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // Vars
  const darkImg = "/images/pages/auth-mask-dark.png";
  const lightImg = "/images/pages/auth-mask-light.png";
  const darkIllustration = "/images/illustrations/auth/v2-login-dark.png";
  const lightIllustration = "/images/illustrations/auth/v2-login-light.png";

  const borderedDarkIllustration =
    "/images/illustrations/auth/v2-login-dark-border.png";

  const borderedLightIllustration =
    "/images/illustrations/auth/v2-login-light-border.png";

  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();

  const { settings } = useSettings();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const authBackground = useImageVariant(mode, lightImg, darkImg);

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration,
  );

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: 'onChange' // Enable real-time validation
  });

  // ErrorMessage Helper Function
  const getLoginErrorMessage = (response) => {
    if (!response) return "Network error occurred";
    if (response.status === 401) return "Invalid email or password";
    if (response.error) return response.error;

    return "Something went wrong, please try again";
  };

  const handleLogin = useCallback(async (data) => {
    try {
      setShowLoading(true);

      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // Early return for successful login
      if (response?.ok) {
        toast.success("Login successful!");
        router.replace(searchParams.get("redirectTo") ?? "/");

        return;
      }

      // Handle error cases
      const errorMessage = getLoginErrorMessage(response);

      toast.error(errorMessage);

    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setShowLoading(false);
    }
  }, [router, searchParams]);

  return (
    <>
      <GlobalLoadingProgress loading={showLoading} />

      <div className="flex bs-full justify-center">
        <div
          className={classnames(
            "flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden",
            {
              "border-ie": settings.skin === "bordered",
            },
          )}
        >
          <LoginIllustration
            src={characterIllustration}
            alt="character-illustration"
          />
          {!isMobile && <MaskImg alt="mask" src={authBackground} />}
        </div>
        <div className="flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]">
          <div className="absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]">
            <Logo />
          </div>
          <div className="flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0">
            <div className="flex flex-col gap-1">
              <Typography variant="h4">{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
              <Typography>
                Please sign-in to your account and start the adventure
              </Typography>
            </div>
            <form
              noValidate
              autoComplete="off"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(handleLogin)}
            >
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    {...(errors.email && {
                      error: true,
                      helperText:
                        errors?.email?.message,
                    })}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Password"
                    placeholder="············"
                    id="login-password"
                    type={isPasswordShown ? "text" : "password"}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={handleClickShowPassword}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <i
                                className={
                                  isPasswordShown
                                    ? "tabler-eye"
                                    : "tabler-eye-off"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...(errors.password && {
                      error: true,
                      helperText: errors.password.message,
                    })}
                  />
                )}
              />
              <div className="flex justify-end items-center gap-x-3 gap-y-1 flex-wrap">
                <Typography
                  className="text-end"
                  color="primary.main"
                  component={Link}
                  href={"/forgot-password"}
                >
                  Forgot password?
                </Typography>
              </div>
              <Button fullWidth variant="contained" type="submit">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
