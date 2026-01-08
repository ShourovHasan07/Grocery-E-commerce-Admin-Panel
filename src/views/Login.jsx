"use client";

// React Imports
import { useCallback, useState } from "react";

// Next Imports
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// MUI Imports
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

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

// Styled Components
const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxBlockSize: 680,
  maxInlineSize: "100%",
  margin: theme.spacing(12),
}));

const MaskImg = styled("img")({
  maxBlockSize: 355,
  inlineSize: "100%",
  position: "absolute",
  insetBlockEnd: 0,
  zIndex: -1,
});

// Validation Schema
const schema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = ({ mode }) => {
  const [showLoading, setShowLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const authBackground = useImageVariant(
    mode,
    "/images/pages/auth-mask-light.png",
    "/images/pages/auth-mask-dark.png"
  );

  const illustration = useImageVariant(
    mode,
    "/images/illustrations/auth/v2-login-light.png",
    "/images/illustrations/auth/v2-login-dark.png"
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = useCallback(
    async (data) => {
      try {
        setShowLoading(true);

        await signIn("credentials", {
          email: data.email,
          password: data.password,

          // 🔥 IMPORTANT
          redirect: true,

          // login success হলে এখানে যাবে
          callbackUrl: searchParams.get("redirectTo") ?? "/dashboard",
        });
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed");
      } finally {
        setShowLoading(false);
      }
    },
    [searchParams]
  );

  return (
    <>
      <GlobalLoadingProgress loading={showLoading} />

      <div className="flex bs-full justify-center">
        <div
          className={classnames(
            "flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden",
            { "border-ie": settings.skin === "bordered" }
          )}
        >
          <LoginIllustration src={illustration} alt="login" />
          {!isMobile && <MaskImg src={authBackground} alt="mask" />}
        </div>

        <div className="flex justify-center items-center bs-full bg-backgroundPaper p-6 md:p-12 md:is-[480px]">
          <div className="absolute top-6 left-6">
            <Logo />
          </div>

          <div className="flex flex-col gap-6 w-full max-w-[400px]">
            <div>
              <Typography variant="h4">
                Welcome to {themeConfig.templateName}! 👋
              </Typography>
              <Typography>Please sign in to continue</Typography>
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
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={isPasswordShown ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setIsPasswordShown((prev) => !prev)
                              }
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
                  />
                )}
              />

              <Button fullWidth variant="contained" type="submit">
                Login
              </Button>

              <Typography
                component={Link}
                href="/forgot-password"
                color="primary"
                textAlign="right"
              >
                Forgot password?
              </Typography>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
