import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "@/api/auth";
import { useSnackbar } from "@/contexts/SnackbarContext";

export function useLogout() {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear user data from the cache
      queryClient.setQueryData(["me"], null);
      // Invalidate all queries to refetch user data
      // and user specific follow / upvote states
      queryClient.invalidateQueries();
      showSuccess("Logout successful!");
      navigate({ to: "/" });
    },
    onError: () => {
      showError("Logout failed. Please try again.");
    },
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
