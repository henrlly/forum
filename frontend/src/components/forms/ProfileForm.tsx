import { zodResolver } from "@hookform/resolvers/zod";
import { Email, Person, Save } from "@mui/icons-material";
import { Alert, Stack, Typography } from "@mui/material";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  FormField,
  FormHeader,
  FormSubmitButton,
} from "@/components/common/form";
import { USERNAME_HELPER_TEXT } from "@/constants/users";
import { useUpdateProfile } from "@/hooks/user";
import { profileSchema } from "@/schema/users";
import type { UpdateProfileRequest } from "@/types/user";

interface ProfileFormProps {
  defaultValues: UpdateProfileRequest;
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange",
  });

  const { updateProfile, isLoading, error } = useUpdateProfile(reset);

  const onSubmitHandler = (data: UpdateProfileRequest) => updateProfile(data);

  return (
    <FormContainer wrapInContainer={false}>
      <FormHeader
        icon={<Person fontSize="medium" color="primary" />}
        title="Profile Information"
        subtitle="Update your account details"
      />

      <Stack
        direction="column"
        spacing={2}
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        width="100%"
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {((error as AxiosError)?.response?.data as string) ||
              "Profile update failed. Please try again."}
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

        <FormSubmitButton
          disabled={!isDirty || !isValid}
          isSubmitting={isLoading}
          loadingText="Updating..."
        >
          <Save />
          Update Profile
        </FormSubmitButton>

        {isDirty && (
          <Typography variant="body2" color="error">
            You have unsaved changes.
          </Typography>
        )}
      </Stack>
    </FormContainer>
  );
}
