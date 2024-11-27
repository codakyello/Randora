"use client";
import React, {
  useContext,
  createContext,
  useEffect,
  ReactNode,
  useReducer,
} from "react";
import { useRouter } from "next/navigation";
import { authorize } from "@/app/_lib/data-service";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

type User = {
  token: string;
  isRoot: boolean;
  _id: string;
  email: string;
  name: string;
  image: string;
};
const AuthContext = createContext<
  | {
      user: User | null;
      isAuthenticating: boolean;
      authenticated: boolean;
      isLogoutAction: boolean;
      logout: () => void;
      login: (user: User | null) => void;
      setToken: (token: string | null) => void;
      getToken: () => string | null;
    }
  | undefined
>(undefined);

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticating: boolean;
  authenticated: boolean;
  isLogoutAction: boolean;
};

type ActionType =
  | { type: "logout" }
  | { type: "user"; payload: User | null }
  | { type: "token"; payload: string | null }
  | { type: "authenticating/start" }
  | { type: "authenticating/finished" }
  | { type: "authenticated" }
  | { type: "not-authenticated" };

const initialState = {
  user: null,
  isAuthenticating: true,
  authenticated: false,
  isLogoutAction: false,
  token: null,
};

function reducer(state: AuthState, action: ActionType) {
  switch (action.type) {
    case "logout":
      return {
        ...state,
        user: null,
        token: null,
        setAuthenticated: false,
        setLogoutAction: true,
      };

    case "user":
      return { ...state, user: action.payload };
    case "token":
      return { ...state, token: action.payload };
    case "authenticating/start":
      return { ...state, isAuthenticating: true };
    case "authenticating/finished":
      return { ...state, isAuthenticating: false };
    case "authenticated":
      return { ...state, authenticated: true };
    case "not-authenticated":
      return { ...state, authenticated: false };
    default:
      // in development
      // throw new Error(
      //   `Unknown action type: ${action.type}. Please check the reducer for valid action types.`
      // );
      return state;
  }
}
function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // const [user, setUser] = useState<User | null>(null);
  // const [isAuthenticating, setIsAuthenticating] = useState(true);
  // const [authenticated, setAuthenticated] = useState(false);
  // const [isLogoutAction, setLogoutAction] = useState(false);
  // const [token, setToken] = useState<string | null>(null);

  const [
    { user, isAuthenticating, authenticated, isLogoutAction, token },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Load user from localStorage on initial mount
  useEffect(() => {
    // setIsAuthenticating(true);
    dispatch({ type: "authenticating/start" });
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      dispatch({ type: "user", payload: JSON.parse(storedUser) });

      dispatch({ type: "token", payload: JSON.parse(token) });

      Cookies.set("token", JSON.parse(token));
    } else {
      // setIsAuthenticating(false);
      dispatch({ type: "authenticating/finished" });
      // setAuthenticated(false);
      dispatch({ type: "not-authenticated" });
    }
  }, []);

  // Check authenticated on mount and on router change
  useEffect(() => {
    if (!token) {
      // setAuthenticated(false);
      dispatch({ type: "not-authenticated" });

      return;
    }

    (async function authenticate() {
      // setIsAuthenticating(true);
      dispatch({ type: "authenticating/start" });

      try {
        await authorize(token);
        // setAuthenticated(true);
        dispatch({ type: "authenticated" });
      } catch {
        logout();
      } finally {
        // setIsAuthenticating(false);
        dispatch({ type: "authenticating/finished" });
      }
    })();
  }, [token]);

  // Set User (only when user is not null)
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
      Cookies.set("token", token);
    }
  }, [user, token]);

  function login(user: User | null) {
    dispatch({ type: "user", payload: user });
  }

  function setToken(token: string | null) {
    dispatch({ type: "token", payload: token });

    if (token) Cookies.set("token", token);
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
  }

  function getToken(): string | null {
    const storedToken = localStorage.getItem("token");
    const token: string | null = storedToken ? JSON.parse(storedToken) : null;
    if (!token) {
      logout();
      toast.error("You are not logged in!");
      router.push("/login");
    }
    return token;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticating,
        authenticated,
        isLogoutAction,
        setToken,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("You cannot use Authentication outside its provider");

  return context;
}

export default AuthProvider;
