import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'react-native-axios';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const GlobalProvider = ({children}) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                
                if (token) {
                    const response = await axios.post(
                        `${apiUrl}/users/userdata`,
                        { token },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        }
                    );
                    
                    setIsLogged(true);
                    setUser(response.data.data);
                } else {
                    setIsLogged(false);
                    setUser(null);
                }
            } catch (error) {
                console.log('Error:', error);
                setIsLogged(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                isLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;