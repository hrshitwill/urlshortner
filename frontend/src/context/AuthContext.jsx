import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Logged In User
    const fetchUser = async () => {

        try {

            const res = await api.get("/auth/me");

            setUser(res.data.user);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);

        }

    };

    // Login
    const login = async (email, password) => {

        const res = await api.post("/auth/login", {
            email,
            password
        });

        await fetchUser();

        return res;

    };

    // Register
    const register = async (name, email, password) => {

        const res = await api.post("/auth/register", {
            name,
            email,
            password
        });

        return res;

    };

    // Logout
    const logout = async () => {

        try {

            await api.post("/auth/logout");

        } catch (error) {

            console.log(error);

        }

        setUser(null);

    };

    useEffect(() => {

        fetchUser();

    }, []);

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                fetchUser,
                setUser
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);