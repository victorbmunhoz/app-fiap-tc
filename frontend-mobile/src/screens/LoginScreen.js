import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.status === 200) {
                const { token } = response.data;
                const { id, role, isAdmin, name } = response.data.user;

                const userData = { id, email, role, isAdmin, name };
                await login(userData, token);
                navigation.navigate('Main');
            } else {
                Alert.alert('Erro', 'Credenciais inválidas');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            Alert.alert('Erro', 'Não foi possível fazer o login.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.logoContainer}>
                <Ionicons name="log-in-outline" size={60} color="#007BFF" />
                <Text style={styles.title}>Tech Blog Login</Text>
            </View>

            <View style={styles.formContainer}>
                {/* Email */}
                <Text style={styles.label}>📧 Email:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Senha */}
                <Text style={styles.label}>🔒 Senha:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {/* Botão de Login */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F4F8',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007BFF',
        marginTop: 10,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    label: {
        marginBottom: 5,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#FDFDFD',
    },
    loginButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    loginText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
