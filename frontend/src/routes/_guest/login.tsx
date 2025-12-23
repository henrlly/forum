import { zodResolver } from "@hookform/resolvers/zod";
import { Email, Lock } from "@mui/icons-material";
import { Alert, Stack } from "@mui/material";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormContainer,
  FormField,
  FormHeader,
  FormLink,
  FormSubmitButton,
} from "@/components/common/form";
import { useLogin } from "@/hooks/user";
import { loginSchema } from "@/schema/users";
import type { LoginRequest } from "@/types/user";

const registerSuccessSearchParamSchema = z.object({
  register_success: z.literal(true).optional().catch(undefined),
});

type RegisterSuccessSearchParams = z.infer<
  typeof registerSuccessSearchParamSchema
>;

export const Route = createFileRoute("/_guest/login")({
  component: LoginPage,
  validateSearch: (search): RegisterSuccessSearchParams =>
    registerSuccessSearchParamSchema.parse(search),
});

function LoginPage() {
  const { register_success } = useSearch({ from: "/_guest/login" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    // mode: "onChange",
  });

  const { login, isLoading, error } = useLogin();

  const onSubmitHandler = (data: LoginRequest) => login(data);

  return (
    <FormContainer wrapInContainer={true}>
      <FormHeader
        icon={<Lock fontSize="large" color="primary" />}
        title="Sign In"
      />

      <Stack
        direction="column"
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        width="100%"
      >
        {register_success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {"Registration successful! Please log in to continue."}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {"Invalid email or password. Please try again."}
          </Alert>
        )}

        <FormField
          {...register("email")}
          id="email"
          label="Email Address"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
          autoFocus
          disabled={isLoading}
          icon={<Email />}
        />

        <FormField
          {...register("password")}
          id="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="current-password"
          disabled={isLoading}
          icon={<Lock />}
        />

        <FormSubmitButton isSubmitting={isLoading} loadingText="Signing In...">
          Sign In
        </FormSubmitButton>

        <FormLink
          text="Don't have an account?"
          linkText="Sign up here"
          href="/register"
        />
      </Stack>
    </FormContainer>
  );
}
