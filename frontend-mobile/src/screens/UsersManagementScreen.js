import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { getAllUsers, deleteUser } from '../services/userService';
import { useFocusEffect } from '@react-navigation/native';

// 🧩 Componente Principal
const UserManagementScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const scaleValue = new Animated.Value(1);

    // 🎯 Carregar usuários ao montar o componente
    useEffect(() => {
        fetchUsers();
    }, []);

    // 🔁 Recarregar usuários sempre que a tela for focada
    useFocusEffect(
        React.useCallback(() => {
            fetchUsers();
        }, [])
    );

    // 🚀 Função para buscar usuários
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const userList = await getAllUsers();
            setUsers(userList);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            Alert.alert('⚠️ Erro', 'Não foi possível carregar os usuários.');
        } finally {
            setLoading(false);
        }
    };

    // 🛑 Função para excluir usuário com confirmação
    const handleDelete = async (user) => {
        Alert.alert(
            '🗑️ Excluir Usuário',
            `Tem certeza que deseja excluir o usuário "${user.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteUser(user.id, user.role);
                            fetchUsers();
                            Alert.alert('✅ Sucesso', 'Usuário excluído com sucesso!');
                        } catch (error) {
                            console.error('Erro ao excluir usuário:', error);
                            Alert.alert('⚠️ Erro', 'Não foi possível excluir o usuário.');
                        }
                    },
                },
            ]
        );
    };

    // 🎨 Renderizar cada usuário
    const renderUser = ({ item }) => {
        const userRoleText = item.role === 'teacher'
            ? item.isAdmin ? 'Professor Administrador' : 'Professor'
            : 'Estudante';

        const roleColor = item.role === 'teacher' 
            ? item.isAdmin ? '#FFC107' : '#4CAF50'
            : '#2196F3';

        return (
            <TouchableOpacity
                style={[styles.userCard, { borderLeftColor: roleColor }]}
                onPress={() => navigation.navigate('UserForm', { user: item })}
            >
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userInfo}>📧 {item.email}</Text>
                <Text style={[styles.userInfo, { color: roleColor }]}>🛠️ {userRoleText}</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('UserForm', { user: item })}
                    >
                        <Text style={styles.buttonText}>✏️ Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item)}
                    >
                        <Text style={styles.buttonText}>🗑️ Excluir</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    // ⏳ Exibir indicador de carregamento
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Carregando usuários...</Text>
            </View>
        );
    }

    // 📱 Renderizar a lista de usuários e o botão de adicionar
    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => `${item.role}_${item.id}`}
                renderItem={renderUser}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
                }
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('UserForm')}
            >
                <Text style={styles.addButtonText}>➕ Adicionar Novo Usuário</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UserManagementScreen;

// 🌈 Estilização
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F3F6FA',
    },
    userCard: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 5,
    },
    userInfo: {
        fontSize: 14,
        color: '#555',
        marginVertical: 2,
    },
    actionButtons: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#E53935',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 20,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        color: '#555',
        marginTop: 20,
        fontSize: 16,
    },
});
