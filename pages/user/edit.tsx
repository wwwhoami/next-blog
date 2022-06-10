import Layout from '@/components/Layout'
import UserProfileTabgroup from '@/components/UserProfileTabgroup'
import { NextPage } from 'next'

type Props = {}

const Edit: NextPage = (props: Props) => {
  return (
    <Layout title="Edit profile">
      <div className="flex items-center justify-center flex-col">
        <div className="mt-32 p-10 bg-slate-50 rounded-2xl">
          <h1 className="text-3xl font-bold mb-10">Edit profile</h1>
          <UserProfileTabgroup />
        </div>
      </div>
    </Layout>
  )
}

export default Edit
