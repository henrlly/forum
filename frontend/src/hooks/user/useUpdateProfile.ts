import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userApi } from "@/api/user";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { UpdateProfileRequest } from "@/types/user";

export function useUpdateProfile(onSuccessCallback?: () => void) {
  const { showSuccess, showError } = useSnackbar();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate all queries to ensure fresh data,
      // because the user's username might have changed.
      queryClient.invalidateQueries();
      // queryClient.invalidateQueries({ queryKey: ["me"] });
      showSuccess("Updated profile successfully!");
      onSuccessCallback?.();
    },
    onError: (err) => {
      showError(
        ((err as AxiosError)?.response?.data as string) ||
          "Profile update failed. Please try again.",
      );
    },
  });

  return {
    updateProfile: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
