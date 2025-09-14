import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
//import Cookies from 'js-cookie';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

/*   useEffect(() => {
    //Solo en el lado del cliente
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []); */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include", //Este lleva las cookies
        })

        if(res.ok){
          const data = await res.json();
          setIsAuthenticated(true);
          setToken("valid");
        } else {
          setIsAuthenticated(false)
          setToken(null)
        }
      } catch(err) {
        console.error("Auth check error", err)
        setIsAuthenticated(false)
      }
    }
    checkAuth();
  }, [])

  const login = () => {
    /* localStorage.setItem("token", newToken || "session");
    setToken(newToken || "session"); */
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include"})
    /* localStorage.removeItem("token"); */
    //Cookies.remove("token"); //Eliminar cookie
    setToken(null);
    setIsAuthenticated(false);
    router.push("/"); // Redirige al login
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
