import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-10 mt-32 bg-slate-50 rounded-2xl">
        <h1 className="mb-10 text-3xl font-bold">Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
