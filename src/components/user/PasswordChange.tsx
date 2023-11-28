"use client";

import { UserApiResponse } from "@/types/User";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "src/context/userContext";
import isStrongPassword from "validator/lib/isStrongPassword";
import PasswordInput from "../form/PasswordInput";

type Props = {};

const PasswordChange = ({}: Props) => {
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [errorResponse, setErrorResponse] = useState<Error>();

  const { user, setUser } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      user?.accessToken &&
      !oldPasswordError &&
      !newPasswordError &&
      oldPassword?.length &&
      newPassword?.length
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
            password: oldPassword,
            newPassword,
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

        toast.success("🦄 Password changed successfully!", {
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
          className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          {Array.isArray(errorResponse.message) ? (
            <ul className="mx-4 list-disc">
              {(errorResponse.message as string[]).map((message, idx) => (
                <li key={idx} className="font-medium">
                  {message.charAt(0).toUpperCase() + message.slice(1)}
                </li>
              ))}
            </ul>
          ) : (
            <span className="font-medium">
              {errorResponse.message.charAt(0).toUpperCase() +
                errorResponse.message.slice(1)}
            </span>
          )}
        </div>
      )}
      <PasswordInput
        label="Old password"
        value={oldPassword}
        onChange={(e) => {
          setOldPassword(e.target.value);
          if (oldPasswordError)
            setOldPasswordError(
              !isStrongPassword(e.target.value, {
                minLength: 8,
                minLowercase: 0,
                minUppercase: 0,
                minNumbers: 0,
                minSymbols: 0,
                returnScore: false,
                pointsPerUnique: 1,
                pointsPerRepeat: 0.5,
                pointsForContainingLower: 10,
                pointsForContainingUpper: 10,
                pointsForContainingNumber: 10,
                pointsForContainingSymbol: 10,
              }),
            );
        }}
        onBlur={(e) => {
          setOldPasswordError(
            !isStrongPassword(e.target.value, {
              minLength: 8,
              minLowercase: 0,
              minUppercase: 0,
              minNumbers: 0,
              minSymbols: 0,
              returnScore: false,
              pointsPerUnique: 1,
              pointsPerRepeat: 0.5,
              pointsForContainingLower: 10,
              pointsForContainingUpper: 10,
              pointsForContainingNumber: 10,
              pointsForContainingSymbol: 10,
            }),
          );
        }}
        type="text"
        id="oldPassword"
        placeholder="************"
        hasError={oldPasswordError}
        errorMessage="Password should be at least 8 characters long"
      />
      <PasswordInput
        label="New password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          if (newPasswordError)
            setNewPasswordError(
              !isStrongPassword(e.target.value, {
                minLength: 8,
                minLowercase: 0,
                minUppercase: 0,
                minNumbers: 0,
                minSymbols: 0,
                returnScore: false,
                pointsPerUnique: 1,
                pointsPerRepeat: 0.5,
                pointsForContainingLower: 10,
                pointsForContainingUpper: 10,
                pointsForContainingNumber: 10,
                pointsForContainingSymbol: 10,
              }),
            );
        }}
        onBlur={(e) => {
          setNewPasswordError(
            !isStrongPassword(e.target.value, {
              minLength: 8,
              minLowercase: 0,
              minUppercase: 0,
              minNumbers: 0,
              minSymbols: 0,
              returnScore: false,
              pointsPerUnique: 1,
              pointsPerRepeat: 0.5,
              pointsForContainingLower: 10,
              pointsForContainingUpper: 10,
              pointsForContainingNumber: 10,
              pointsForContainingSymbol: 10,
            }),
          );
        }}
        id="newPassword"
        placeholder="************"
        hasError={newPasswordError}
        errorMessage="Password should be at least 8 characters long"
      />
      <button
        type="submit"
        className={`focus-ring focus-within:ring-primary w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white focus-within:ring focus-within:ring-opacity-50 hover:bg-indigo-500 focus:outline-none sm:w-auto ${
          newPasswordError ||
          oldPasswordError ||
          !newPassword?.length ||
          !oldPassword?.length
            ? "cursor-not-allowed opacity-80"
            : ""
        }`}
      >
        Change password
      </button>
    </form>
  );
};

export default PasswordChange;
