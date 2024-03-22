import { toast} from "react-toastify";

export const displayErrorMessage = (message: string) => {
    toast.error(message);
}

export const displaySuccessMessage = (message: string) => {
    toast.success(message);
};