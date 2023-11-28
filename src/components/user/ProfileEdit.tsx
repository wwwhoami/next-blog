"use client";

import { UserApiResponse } from "@/types/User";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "src/context/userContext";
import isEmail from "validator/lib/isEmail";
import FormInput from "../form/FormInput";

type Props = {};

const ProfileEdit = ({}: Props) => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [errorResponse, setErrorResponse] = useState<Error>();

  // Reinitialize name and email states on page refresh
  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
  }, [user?.name, user?.email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      user?.accessToken &&
      !nameError &&
      !emailError &&
      name?.length &&
      email?.length
    ) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            name,
            email,
          }),
        },
      );

      const data: UserApiResponse | Error = await res.json();

      if (!res.ok && "message" in data) {
        setErrorResponse(data);
      }

      if (res.ok && "accessToken" in data) {
        setUser(data);
        setErrorResponse(undefined);

        toast.success("🦄 Profile data updated successfully!", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        router.back();
      }
    }
  };

  return (
    <form className="w-80" onSubmit={handleSubmit}>
      {!!errorResponse && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">{errorResponse.message}</span>
        </div>
      )}
      <FormInput
        label="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError(!e.target.value.length);
        }}
        onBlur={(e) => {
          setNameError(!e.target.value);
        }}
        type="text"
        id="name"
        placeholder="Enter preferred username"
        hasError={nameError}
        errorMessage="Name should not be empty"
      />
      <FormInput
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError(!isEmail(e.target.value));
        }}
        onBlur={(e) => {
          setEmailError(!isEmail(e.target.value));
        }}
        type="email"
        id="email"
        placeholder="somemail@example.com"
        hasError={emailError}
        errorMessage="Wrong email format"
      />
      <button
        type="submit"
        className={`text-white bg-indigo-600 hover:bg-indigo-500 focus-ring focus:outline-none focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
          emailError || nameError || !email?.length || !name?.length
            ? "cursor-not-allowed opacity-80"
            : ""
        }`}
      >
        Update profile
      </button>
    </form>
  );
};

export default ProfileEdit;
