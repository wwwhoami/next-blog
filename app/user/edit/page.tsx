import UserProfileTabgroup from '@/components/user/UserProfileTabgroup'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit profile',
  description: 'Edit profile page',
}

export default function Edit() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-32 rounded-2xl bg-slate-50 p-10">
        <h1 className="mb-10 text-3xl font-bold">Edit profile</h1>
        <UserProfileTabgroup />
      </div>
    </div>
  )
}
