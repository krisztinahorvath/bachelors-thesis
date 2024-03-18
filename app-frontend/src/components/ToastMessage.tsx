import { toast, ToastPosition } from "react-toastify";

export const displayErrorMessage = (message: string) => {
    const position: ToastPosition = 'top-center';
    toast.error(message, {
        position: position,
    });
}

export const displaySuccessMessage = (message: string) => {
    const position: ToastPosition = 'top-center';
    toast.success(message, {
      position: position,
    });
};