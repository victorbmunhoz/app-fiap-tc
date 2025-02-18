import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const AdminScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [hasPosts, setHasPosts] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verificar se o usuário tem posts criados
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await api.get(`/posts?authorId=${user.id}`);
                setHasPosts(response.data.length > 0);
            } catch (error) {
                console.error('Erro ao verificar posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [user.id]);

    // Botão para gerenciar ou criar posts
    const handlePostNavigation = () => {
        if (hasPosts) {
            navigation.navigate('PostsManagementScreen');
        } else {
            navigation.navigate('PostFormScreen');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚙️ Área Administrativa</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <View style={styles.buttonContainer}>
                    {/* Botão de Gerenciamento de Posts */}
                    <TouchableOpacity style={styles.button} onPress={handlePostNavigation}>
                        <Ionicons name={hasPosts ? 'document-text-outline' : 'add-circle-outline'} size={24} color="#fff" />
                        <Text style={styles.buttonText}>
                            {hasPosts ? 'Gerenciar Posts' : 'Criar Primeiro Post'}
                        </Text>
                    </TouchableOpacity>

                    {/* Botão de Gerenciamento de Usuários (Apenas para Admins) */}
                    {user.isAdmin && (
                        <TouchableOpacity
                            style={[styles.button, styles.adminButton]}
                            onPress={() => navigation.navigate('UserManagement')}
                        >
                            <Ionicons name="people-outline" size={24} color="#fff" />
                            <Text style={styles.buttonText}>Gerenciar Usuários</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

export default AdminScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#E3F2FD',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#0D47A1',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    adminButton: {
        backgroundColor: '#2E7D32',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
