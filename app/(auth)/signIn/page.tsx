import SignInForm from '@/components/auth/SignInForm'

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-32 rounded-2xl bg-slate-50 p-10">
        <h1 className="mb-10 text-3xl font-bold">Sign In</h1>
        <SignInForm />
      </div>
    </div>
  )
}
