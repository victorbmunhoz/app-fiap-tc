import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';

// Contexto
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Telas
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdminScreen from './src/screens/AdminScreen';
import UserScreen from './src/screens/UserScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import PostsManagementScreen from './src/screens/PostsManagementScreen';
import PostFormScreen from './src/screens/PostFormScreen';
import UsersManagementScreen from './src/screens/UsersManagementScreen';
import UserFormScreen from './src/screens/UserFormScreen';

// Ícones
import { Ionicons } from '@expo/vector-icons';

// Instâncias de navegação
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🔹 **Componente das Abas Inferiores**
function MyTabs() {
    const { user, isAdmin, isTeacher } = useAuth();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Blog':
                            iconName = 'home-outline';
                            break;
                        case 'Admin':
                            iconName = 'settings-outline';
                            break;
                        case 'User':
                            iconName = 'person-outline';
                            break;
                        default:
                            iconName = 'help-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007BFF',
                tabBarInactiveTintColor: '#555',
                tabBarStyle: { height: 60, paddingBottom: 10 },
            })}
        >
            {/* Todos os logados podem acessar */}
            <Tab.Screen name="Blog" component={HomeScreen} options={{ title: 'Posts' }} />

            {/* Apenas Professores acessam */}
            {isTeacher() && (
                <Tab.Screen name="Admin" component={AdminScreen} options={{ title: 'Administração' }} />
            )}
            
            {/* TODOS acessam */}
            <Tab.Screen name="User" component={UserScreen} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
}

// 🔹 **Componente Principal**
export default function App() {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🚨 **Limpar o SecureStore ao iniciar**
    useEffect(() => {
        const clearAuthData = async () => {
            try {
                await SecureStore.deleteItemAsync('userToken');
                await SecureStore.deleteItemAsync('userData');
                setToken(null);
            } catch (error) {
                console.error('⚠️ Erro ao limpar o token:', error);
            } finally {
                setLoading(false);
            }
        };
        clearAuthData();
    }, []);

    if (loading) {
        return null; // Evitar piscar durante o carregamento
    }

    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={token ? 'Main' : 'Login'}>
                    {/* Tela de Login */}
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ title: '🔑 Login', headerShown: false }}
                    />

                    {/* Navegação Principal com Bottom Tabs */}
                    <Stack.Screen
                        name="Main"
                        component={MyTabs}
                        options={{ headerShown: false }}
                    />

                    {/* Tela de Detalhes do Post */}
                    <Stack.Screen
                        name="PostDetail"
                        component={PostDetailScreen}
                        options={{ title: '📰 Detalhes do Post' }}
                    />

                    {/* Tela de Gerenciamento de Posts */}
                    <Stack.Screen
                        name="PostsManagementScreen"
                        component={PostsManagementScreen}
                        options={{ title: '📰 Gerenciamento de Posts' }}
                    />
                    
                    {/* Tela Criação e Edição de Posts */}
                    <Stack.Screen 
                        name="PostFormScreen" 
                        component={PostFormScreen} 
                        options={{ title: 'Gerenciar Post' }} 
                    />

                    <Stack.Screen 
                        name="UserManagement" 
                        component={UsersManagementScreen} 
                        options={{ title: 'Gerenciamento de Usuários' }} 
                    />

                    <Stack.Screen 
                        name="UserForm" 
                        component={UserFormScreen} 
                        options={{ title: 'Gerenciar Usuário' }} 
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}
