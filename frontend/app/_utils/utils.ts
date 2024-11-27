import toast from "react-hot-toast";
import { useAuth } from "../_contexts/AuthProvider";

export function useHandleUnAuthorisedResponse() {
  const { logout } = useAuth();

  const handleUnAuthorisedResponse = (statusCode: number | undefined) => {
    if (statusCode === 401) {
      logout(); // Clear the user context on 401
    }
  };

  return handleUnAuthorisedResponse;
}

export function showToastMessage(
  status: string | undefined,
  errorMessage: string | undefined,
  successMessage: string
) {
  if (status === "error") {
    toast.error(new Error(errorMessage!).message);
  } else {
    toast.success(successMessage);
  }
}
