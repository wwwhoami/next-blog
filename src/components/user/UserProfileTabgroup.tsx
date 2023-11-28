"use client";

import { Tab } from "@headlessui/react";
import PasswordChange from "./PasswordChange";
import ProfileEdit from "./ProfileEdit";

type Props = {};

const UserProfileTabgroup = ({}: Props) => {
  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            key="Account"
            className={({ selected }) => `
                focus-ring w-full rounded-lg py-2.5 text-sm font-medium leading-5
              text-indigo-700 focus:ring-opacity-60
              ${
                selected
                  ? "bg-white shadow"
                  : "text-indigo-100 hover:bg-white/[0.12] hover:text-white"
              }`}
          >
            Account
          </Tab>
          <Tab
            key="Password"
            className={({ selected }) =>
              `focus-ring w-full rounded-lg py-2.5 text-sm font-medium leading-5
              text-indigo-700 focus:ring-opacity-60
                ${
                  selected
                    ? "bg-white shadow"
                    : "text-indigo-100 hover:bg-white/[0.12] hover:text-white"
                }`
            }
          >
            Password
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            key="Account"
            className="focus-ring rounded-xl p-3 focus:ring-opacity-60"
          >
            <ProfileEdit />
          </Tab.Panel>
          <Tab.Panel
            key="Password"
            className="focus-ring rounded-xl p-3 focus:ring-opacity-60"
          >
            <PasswordChange />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default UserProfileTabgroup;
