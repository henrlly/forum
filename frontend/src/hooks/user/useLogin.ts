import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "@/api/auth";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { LoginRequest } from "@/types/user";

export function useLogin() {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (loginRequest: LoginRequest) => authApi.login(loginRequest),
    onSuccess: () => {
      // Invalidate all queries to refetch user data
      // and user specific follow / upvote states
      queryClient.invalidateQueries();
      showSuccess("Login successful!");
      navigate({ to: "/" });
    },
    onError: () => {
      showError("Login failed. Please check your credentials and try again.");
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
