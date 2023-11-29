import AuthModal from '@/components/AuthModal'
import SignInForm from '@/components/auth/SignInForm'

export default function SignIn() {
  return (
    <AuthModal title={'Sign In'}>
      <SignInForm />
    </AuthModal>
  )
}
