import SignInForm from '@/components/auth/SignInForm'

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-10 mt-32 rounded-2xl bg-slate-50 dark:bg-slate-800">
        <h1 className="mb-10 text-3xl font-bold dark:text-white">Sign In</h1>
        <SignInForm />
      </div>
    </div>
  )
}
