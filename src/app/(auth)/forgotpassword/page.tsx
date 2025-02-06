import { Toaster } from "sonner";
import ForgotPasswordForm from "./forgotpwd-form";

export default function page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
          <Toaster richColors position="top-right" />
            <ForgotPasswordForm />
          </div>
        </div>
  )
}
