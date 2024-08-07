import { useMemo, useEffect, useReducer, useCallback } from "react";

import axios, { endpoints } from "src/utils/axios";

import { AuthContext } from "./auth-context";
import { setSession, isValidToken } from "./utils";
import { AuthUserType, ActionMapType, AuthStateType } from "../../types";

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
    loading: boolean;
    status: string;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
  status: "",
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
      loading: action.payload.loading,
      status: action.payload.status,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = "accessToken";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        const { exp, ...user } = isValidToken(accessToken);
        const currentTime = Date.now() / 1000;
        if (exp > currentTime) {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: {
                ...user,
                accessToken,
              },
            },
          });
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: null,
            },
          });
        }
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const data = {
      user: {
        email,
        password,
      },
    };

    const res = await axios.post(endpoints.auth.login, data);

    const { success, result } = res.data;

    if (success) {
      setSession(result.JWT_token);

      dispatch({
        type: Types.LOGIN,
        payload: {
          user: {
            ...result.user,
            accessToken: result.JWT_token,
          },
        },
      });
    } else {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      const data = {
        user: {
          email,
          password,
          name: `${firstName} ${lastName}`,
        },
      };

      const res = await axios.post(endpoints.auth.register, data);

      const { success, message, error } = res.data;

      if (success) {
        dispatch({
          type: Types.REGISTER,
          payload: {
            user: null,
            loading: false,
            status: message,
          },
        });
      } else {
        dispatch({
          type: Types.REGISTER,
          payload: {
            user: null,
            loading: true,
            status: error || message,
          },
        });
      }
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
