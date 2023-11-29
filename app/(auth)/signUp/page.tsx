import SignUpForm from '@/components/auth/SignUpForm'

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-32 rounded-2xl bg-slate-50 p-10">
        <h1 className="mb-10 text-3xl font-bold">Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  )
}
