import {
  useMutation,
  useQueryClient,
  UseMutateFunction,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHandleUnAuthorisedResponse } from "../_utils/utils";
import { deleteEvent } from "../_lib/data-service";
import AppError from "../_utils/AppError";
import { useModal } from "../_components/Modal";

interface UseCustomMutationReturn<TData, AppError, TVariables> {
  mutate: UseMutateFunction<TData, AppError, TVariables, unknown>;
  isPending: boolean;
}

export default function useDeleteEvent<
  TData,
  TVariables extends string
>(): UseCustomMutationReturn<TData, AppError, TVariables> {
  const queryClient = useQueryClient();

  const handleUnAuthorisedResponse = useHandleUnAuthorisedResponse();

  const { close } = useModal();

  const { mutate, isPending } = useMutation<TData, AppError, TVariables>({
    mutationFn: async (eventId) => {
      return deleteEvent(eventId) as Promise<TData>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      close();
      toast.success(`Event successfully deleted`);
    },

    onError: (err: AppError) => {
      toast.error(err.message);
      close();
      handleUnAuthorisedResponse(err.statusCode);
    },
  });

  return { mutate, isPending };
}
