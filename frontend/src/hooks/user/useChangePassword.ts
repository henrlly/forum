import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userApi } from "@/api/user";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { ChangePasswordRequest } from "@/types/user";

export function useChangePassword(onSuccessCallback?: () => void) {
  const { showSuccess, showError } = useSnackbar();
  const mutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => userApi.changePassword(data),
    onSuccess: () => {
      showSuccess("Changed password successfully!");
      onSuccessCallback?.();
    },
    onError: (err) => {
      showError(
        ((err as AxiosError)?.response?.data as string) ||
          "Password change failed. Please try again.",
      );
    },
  });

  return {
    changePassword: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
