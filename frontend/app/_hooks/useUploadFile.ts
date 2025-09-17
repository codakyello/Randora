import { uploadFile as uploadFileApi } from "../_lib/data-service";
import useCustomMutation from "./useCustomMutation";

export const useUploadFile = function () {
  const { mutateAsync: uploadFile, isPending: isUploading } =
    useCustomMutation(uploadFileApi);

  return { uploadFile, isUploading };
};
