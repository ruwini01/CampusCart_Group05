import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'; // Add this import

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

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
                        'http://172.20.10.2:8080/admin/admindata',
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