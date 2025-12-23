import { zodResolver } from "@hookform/resolvers/zod";
import { Email, Lock, Person, PersonAdd } from "@mui/icons-material";
import { Alert, Stack } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  FormField,
  FormHeader,
  FormLink,
  FormSubmitButton,
} from "@/components/common/form";
import { PASSWORD_HELPER_TEXT, USERNAME_HELPER_TEXT } from "@/constants/users";
import { useRegister } from "@/hooks/user";
import { registerFormSchema, registerSchema } from "@/schema/users";
import type { RegisterForm } from "@/types/user";

export const Route = createFileRoute("/_guest/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { register: registerUser, isLoading, error } = useRegister();

  const onSubmitHandler = (data: RegisterForm) =>
    registerUser(registerSchema.parse(data));

  return (
    <FormContainer wrapInContainer={true}>
      <FormHeader
        icon={<PersonAdd fontSize="large" color="primary" />}
        title="Sign Up"
      />

      <Stack
        direction="column"
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        width="100%"
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {((error as AxiosError)?.response?.data as string) ||
              "Registration failed. Please try again."}
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
          {...register("username")}
          id="username"
          label="Username"
          error={!!errors.username}
          helperText={errors.username?.message}
          helperTextDefault={USERNAME_HELPER_TEXT}
          autoComplete="username"
          disabled={isLoading}
          icon={<Person />}
        />

        <FormField
          {...register("password")}
          id="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          helperTextDefault={PASSWORD_HELPER_TEXT}
          autoComplete="new-password"
          disabled={isLoading}
          icon={<Lock />}
        />

        <FormField
          {...register("confirmPassword")}
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
          disabled={isLoading}
          icon={<Lock />}
        />

        <FormSubmitButton
          isSubmitting={isLoading}
          loadingText="Creating Account..."
        >
          Create Account
        </FormSubmitButton>

        <FormLink
          text="Already have an account?"
          linkText="Sign in here"
          href="/login"
        />
      </Stack>
    </FormContainer>
  );
}
