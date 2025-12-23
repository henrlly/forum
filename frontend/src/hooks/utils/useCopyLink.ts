import { useSnackbar } from "@/contexts/SnackbarContext";

export function useCopyLink() {
  const { showSuccess, showError } = useSnackbar();

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(
      () => {
        showSuccess("Link copied to clipboard!");
      },
      (_) => {
        showError("Failed to copy link!");
      },
    );
  };

  return { copyLink };
}
