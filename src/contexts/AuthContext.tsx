import { createContext, Dispatch, SetStateAction, useState } from "react";

type DefaultValuesType = {
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  username: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  profileImageUrl: string | null;
  setProfileImageUrl: Dispatch<SetStateAction<string | null>>;
};

const defaultValues: DefaultValuesType = {
  accessToken: null,
  setAccessToken: () => {},
  username: null,
  setUsername: () => {},
  profileImageUrl: null,
  setProfileImageUrl: () => {},
};

export const AuthContext = createContext(defaultValues);

type AuthContextProviderPropType = {
  children: JSX.Element[];
};

export const AuthContextProvider = ({
  children,
}: AuthContextProviderPropType) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        username,
        setUsername,
        profileImageUrl,
        setProfileImageUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
