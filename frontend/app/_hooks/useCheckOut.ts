import {
  useMutation,
  useQueryClient,
  UseMutateFunction,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHandleUnAuthorisedResponse } from "../_utils/utils";
import { updateBooking } from "../_lib/data-service";
import AppError from "../_utils/AppError";
import { useAuth } from "../_contexts/AuthProvider";

interface UseCustomMutationReturn<TData, AppError, TVariables> {
  mutate: UseMutateFunction<TData, AppError, TVariables, unknown>;
  isPending: boolean;
}

export default function useCheckOut<
  TData,
  TVariables extends string
>(): UseCustomMutationReturn<TData, AppError, TVariables> {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const token = getToken();
  const handleUnAuthorisedResponse = useHandleUnAuthorisedResponse();

  const { mutate, isPending } = useMutation<TData, AppError, TVariables>({
    mutationFn: (bookingId) => {
      return updateBooking({
        bookingId,
        token,
        obj: { status: "checked-out" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      console.log("i am here");
      toast.success("Booking successfully checked-out");
    },
    onError: (err: AppError) => {
      toast.error(err.message);

      handleUnAuthorisedResponse(err.statusCode);
    },
  });

  return { mutate, isPending };
}
