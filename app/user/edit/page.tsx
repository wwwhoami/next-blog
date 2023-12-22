import FormCard from '@/components/form/FormCard'
import UserProfileTabgroup from '@/components/user/UserProfileTabgroup'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit profile',
  description: 'Edit profile page',
}

export default function Edit() {
  return (
    <FormCard heading="Edit profile">
      <UserProfileTabgroup />
    </FormCard>
  )
}
