import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { userApi } from "@/api/user";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { RegisterRequest } from "@/types/user";

export function useRegister() {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => userApi.register(data),
    onSuccess: () => {
      showSuccess("Registered successfully!");
      navigate({ to: "/login", search: { register_success: true } });
    },
    onError: (err) => {
      showError(
        ((err as AxiosError)?.response?.data as string) ||
          "Registration failed. Please try again.",
      );
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
