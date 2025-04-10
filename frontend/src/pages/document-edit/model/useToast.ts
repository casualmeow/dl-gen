import { useToastContext } from "../api/toast-provider"

export const useToast = () => {
  const { toast } = useToastContext()
  return { toast }
}
