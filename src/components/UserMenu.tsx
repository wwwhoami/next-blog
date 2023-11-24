import { Menu, Transition } from '@headlessui/react'
import { PencilIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useUser } from 'src/context/userContext'
import useRouterReferer from 'src/hooks/useRouterReferer'
import AuthModal from './AuthModal'
import MenuItem from './MenuItem'
import SignOut from './SignOut'
import UserProfileTabgroup from './UserProfileTabgroup'

type Props = {}

const UserMenu = (props: Props) => {
  const router = useRouter()
  const { backToReferer, referer } = useRouterReferer()
  const { user } = useUser()

  return (
    <div className="px-3 py-2 text-right rounded-full text-slate-700">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="w-10 h-10 rounded-full hover-ring focus-ring">
          <Image
            className="rounded-full"
            src={user?.image ?? ''}
            width={40}
            height={40}
            alt="User avatar"
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <MenuItem Icon={PlusCircleIcon} text="Create post" />
              <MenuItem
                Icon={PencilIcon}
                text="Edit profile"
                onClick={() =>
                  router.push(`/?edit=true&referer=${referer}`, '/user/edit', {
                    shallow: true,
                  })
                }
              />
            </div>
            <div className="px-1 py-1 ">
              <SignOut />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <AuthModal
        isOpen={!!router.query.edit}
        closeModal={backToReferer}
        title={!!router.query.edit ? 'Edit profile' : ''}
      >
        {!!router.query.edit ? <UserProfileTabgroup /> : ''}
      </AuthModal>
    </div>
  )
}

export default UserMenu
