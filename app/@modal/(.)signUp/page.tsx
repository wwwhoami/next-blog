import AuthModal from "@/components/AuthModal";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUp() {
  return (
    <AuthModal title={"Sign Up"}>
      <SignUpForm />
    </AuthModal>
  );
}
