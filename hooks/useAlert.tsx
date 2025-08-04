import { toast } from "react-toastify";
import { CircleAlert, CircleCheck } from "lucide-react";

export default function useAlert() {
  const notify = (message: string) =>
    toast.success(message, {
      style: { backgroundColor: "#4CAF50", color: "#f7f7f7" },
      icon: <CircleCheck color="#f7f7f7" />,
    });
  const notifyError = (error: string) =>
    toast.error(error, {
      style: { backgroundColor: "#D32F2F", color: "#f7f7f7" },
      icon: <CircleAlert color="#f7f7f7" />,
    });

  return { notify, notifyError };
}
