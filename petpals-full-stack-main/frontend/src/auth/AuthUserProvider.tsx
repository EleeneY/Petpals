import { User } from "./auth";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Auth } from "firebase/auth";

type AuthData = {
  user?: User | null;
};

const AuthUserContext = createContext<AuthData | undefined>(undefined);

export default function AuthUserProvider({
  children,
  auth,
}: {
  readonly children: ReactNode;
  readonly auth: Auth;
}) {
  const [user, setUser] = useState<AuthData>({ user: null });
  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setUser({ user: userAuth });
      } else {
        setUser({ user: null });
      }
    });
  }, []);

  return (
    <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthUserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthUserProvider");
  }
  return context;
};