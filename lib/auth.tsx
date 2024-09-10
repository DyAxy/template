import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Crisp } from 'crisp-sdk-web';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isLoggedIn: boolean;
    isAuthChecked: boolean;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    register: (email: string, password: string, email_code: string, invite_code: string, recaptcha_data?: string) => Promise<any>
    reset: (email: string, password: string, email_code: string) => Promise<any>
    changePass: (oldPass: string, newPass: string) => Promise<any>
    sendEmailVerify: (email: string, code?: string | null) => Promise<any>
    webConfig: WebConfig | undefined
    appConfig: AppConfig | undefined
    userInfo: UserInfo | undefined
    getUserInfo: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const router = useRouter();

    const [webConfig, setWebConfig] = useState<WebConfig>()
    const [appConfig, setAppConfig] = useState<AppConfig>()
    const [userInfo, setUserInfo] = useState<UserInfo>()

    const getWebConfig = async () => {
        try {
            const response = await axios.get('/api/guest/comm/config')
            if (response.status === 200) {
                setWebConfig(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAppConfig = async () => {
        try {
            const response = await axios.get('/api/user/comm/config')
            if (response.status === 200) {
                setAppConfig(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await axios.get('/api/user/info')
            if (response.status === 200) {
                setUserInfo(response.data.data)
                Crisp.user.setEmail(response.data.data.email)
                Crisp.user.setAvatar(response.data.data.avatar_url)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkLogin = async () => {
        try {
            const response = await axios.get('/api/user/checkLogin')
            if (response.status === 200 && response.data.success) {
                setIsLoggedIn(true);
                getUserInfo()
                getAppConfig()
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
        } finally {
            setIsAuthChecked(true);
        }
    };

    useEffect(() => {
        getWebConfig()

        const token = localStorage.getItem('authToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            checkLogin();
        } else {
            setIsAuthChecked(true);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("/api/passport/auth/login", {
                "email": email,
                "password": password
            })
            const token = response.data.data.auth_data;
            localStorage.setItem('authToken', token);
            axios.defaults.headers.common['Authorization'] = token
            setIsLoggedIn(true);
            await getUserInfo()
            await getAppConfig()
            router.push('/dashboard');
            return { success: true, data: response.data.data }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const data = (e as AxiosError<ErrorResponse>).response?.data
                return { success: false, data: data?.data }
            } else {
                return { success: false, data: e }
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setIsLoggedIn(false);
        router.push('/login');
    };

    const register = async (
        email: string,
        password: string,
        email_code: string,
        invite_code: string,
        recaptcha_data?: string
    ) => {
        try {
            const response = await axios.post("/api/passport/auth/register", {
                email,
                password,
                email_code,
                invite_code,
                recaptcha_data
            })
            return { success: true, data: response.data.data }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const data = (e as AxiosError<ErrorResponse>).response?.data
                return { success: false, data: data?.data }
            } else {
                return { success: false, data: e }
            }
        }
    }

    const reset = async (email: string, password: string, email_code: string) => {
        try {
            const response = await axios.post("/api/passport/auth/forget", {
                email: email,
                password: password,
                email_code: email_code
            })
            return { success: true, data: response.data.data }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const data = (e as AxiosError<ErrorResponse>).response?.data
                return { success: false, data: data?.data }
            } else {
                return { success: false, data: e }
            }
        }
    }

    const changePass = async (oldPass: string, newPass: string) => {
        try {
            const response = await axios.post("/api/user/changePassword", {
                old_password: oldPass,
                new_password: newPass,
            })
            return { success: true, data: response.data.data }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const data = (e as AxiosError<ErrorResponse>).response?.data
                return { success: false, data: data?.data }
            } else {
                return { success: false, data: e }
            }
        }
    }

    const sendEmailVerify = async (email: string, recaptcha_data?: string | null) => {
        try {
            const response = await axios.post("/api/passport/comm/sendEmailVerify", {
                email, recaptcha_data
            })
            return { success: true, data: response.data.data }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const data = (e as AxiosError<ErrorResponse>).response?.data
                return { success: false, data: data?.data }
            } else {
                return { success: false, data: e }
            }
        }
    }


    return (
        <AuthContext.Provider value={
            {
                isLoggedIn,
                isAuthChecked,
                login,
                logout,
                register,
                reset,
                changePass,
                sendEmailVerify,
                webConfig,
                userInfo,
                getUserInfo,
                appConfig
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};