import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "@mui/icons-material";
import { Alert, Stack } from "@mui/material";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  FormField,
  FormHeader,
  FormSubmitButton,
} from "@/components/common/form";
import { PASSWORD_HELPER_TEXT } from "@/constants/users";
import { useChangePassword } from "@/hooks/user";
import { changePasswordSchema, newPasswordFormSchema } from "@/schema/users";
import type { ChangePasswordForm } from "@/types/user";

export function PasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { changePassword, isLoading, error } = useChangePassword(reset);

  const onSubmitHandler = (data: ChangePasswordForm) =>
    changePassword(changePasswordSchema.parse(data));

  return (
    <FormContainer wrapInContainer={false}>
      <FormHeader
        icon={<Lock fontSize="medium" color="primary" />}
        title="Change Password"
        subtitle="Update your account password"
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
              "Password change failed. Please try again."}
          </Alert>
        )}

        <FormField
          {...register("password")}
          id="password"
          label="New Password"
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
          label="Confirm New Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
          disabled={isLoading}
          icon={<Lock />}
        />

        <FormSubmitButton
          isSubmitting={isLoading}
          disabled={!isValid}
          loadingText="Changing..."
          color="secondary"
        >
          <Lock />
          Change Password
        </FormSubmitButton>
      </Stack>
    </FormContainer>
  );
}
