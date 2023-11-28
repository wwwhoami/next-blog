"use client";

import { User, UserSession } from "@/types/User";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContext = {
  user?: UserSession;
  error?: Error | null;
  refreshSession: () => Promise<void>;
  setUser: Dispatch<SetStateAction<UserSession | undefined>>;
  setError: Dispatch<SetStateAction<Error | undefined | null>>;
};

const UserContext = createContext<UserContext | undefined>(undefined);

UserContext.displayName = "UserContext";

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

type AccessTokenResponse = {
  accessToken: string;
};

type Props = {
  children: ReactNode;
};

export default function UserProvider({ children }: Props) {
  const [user, setUser] = useState<UserSession>();
  const [error, setError] = useState<Error | null>();

  const getCurrentUserData = useCallback(async (accessToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: User | Error = await res.json();

    if (!res.ok && "message" in data) setError(data);

    if (res.ok && "email" in data) {
      setUser((prev) => ({
        ...data,
        accessToken: prev?.accessToken,
      }));
      setError(undefined);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      credentials: "include",
    });

    const data: AccessTokenResponse | Error = await res.json();

    if (!res.ok && "message" in data) setError(data);

    if (res.ok && "accessToken" in data) {
      setUser((prev) => ({
        ...prev,
        accessToken: data.accessToken,
      }));
      setError(undefined);

      await getCurrentUserData(data.accessToken);
    }
  }, [getCurrentUserData]);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      refreshSession();
    }

    return () => {
      ignore = true;
    };
  }, [refreshSession]);

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        refreshSession,
        setUser,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
