import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

// Criação do Contexto de Autenticação
const AuthContext = createContext();

// Provedor de Autenticação
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Carregar os dados salvos ao iniciar o app
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');
                const storedUser = await SecureStore.getItemAsync('userData');
                if (storedToken && storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('⚠️ Erro ao carregar dados de autenticação:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, []);

    // Função de Login
    const login = async (userData, token) => {
        try {
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(userData));
            setUser(userData);
            console.log('✅ Login realizado:', userData);
        } catch (error) {
            console.error('⚠️ Erro ao salvar dados de login:', error);
        }
    };

    // Função de Logout
    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');
            setUser(null);
            console.log('✅ Logout realizado');
        } catch (error) {
            console.error('⚠️ Erro ao remover dados de autenticação:', error);
        }
    };

    // Função para verificar se o usuário é administrador
    const isAdmin = () => user?.isAdmin;

    // Função para verificar se o usuário é professor (com ou sem admin)
    const isTeacher = () => user?.role === 'teacher';

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isTeacher }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para acessar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
