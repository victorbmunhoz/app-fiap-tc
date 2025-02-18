import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const UserScreen = ({ navigation }) => {
    const { user, logout } = useAuth();

    // Mapeamento direto para exibir o tipo de usuário
    const roleMap = {
        admin: 'Professor Administrador',
        teacher: 'Professor',
        student: 'Estudante',
    };
    const userType = user?.isAdmin ? 'Professor Administrador' : roleMap[user?.role] || 'Desconhecido';

    // Função para confirmar e executar o logout
    const handleLogout = () => {
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        navigation.navigate('Login');
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil do Usuário</Text>
            <View style={styles.infoBox}>
                <Text style={styles.label}>👤 Nome:</Text>
                <Text style={styles.value}>{user?.name || 'Desconhecido'}</Text>

                <Text style={styles.label}>📧 Email:</Text>
                <Text style={styles.value}>{user?.email || 'Desconhecido'}</Text>

                <Text style={styles.label}>🔑 Tipo de Usuário:</Text>
                <Text style={styles.value}>{userType}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#0D47A1',
    },
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginTop: 10,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 18,
        color: '#333',
        marginBottom: 5,
    },
    logoutButton: {
        backgroundColor: '#D32F2F',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default UserScreen;
