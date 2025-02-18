import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getPostsByTeacher, deletePost } from '../services/postService';
import { useFocusEffect } from '@react-navigation/native';

const PostsManagementScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carregar posts do professor logado
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const teacherPosts = await getPostsByTeacher(user.id);
            setPosts(teacherPosts);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Recarrega os posts sempre que a tela for focada
        useFocusEffect(
            React.useCallback(() => {
                fetchPosts();
            }, [])
        );

    // Excluir post
    const handleDeletePost = async (postId) => {
        Alert.alert(
            'Excluir Post',
            'Tem certeza que deseja excluir este post?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePost(postId);
                            Alert.alert('Sucesso', 'Post excluído com sucesso!');
                            fetchPosts();
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir o post.');
                        }
                    }
                }
            ]
        );
    };

    // Renderizar card de post
    const renderPost = ({ item, user }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content.substring(0, 60)}...</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('PostFormScreen', { post: item })}
                >
                    <Text style={styles.buttonText}>✏️ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePost(item.id)}
                >
                    <Text style={styles.buttonText}>🗑️ Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Carregando posts...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {posts.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.noPosts}>Nenhum post encontrado.</Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('PostFormScreen')}
                    >
                        <Text style={styles.buttonText}>🆕 Criar Primeiro Post</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPost}
                    />
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('PostFormScreen')}
                    >
                        <Text style={styles.buttonText}>🆕 Criar Novo Post</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default PostsManagementScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 15,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFF',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: '#E53935',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: '600',
    },
    createButton: {
        marginTop: 20,
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 5,
        alignSelf: 'center',
    },
    noPosts: {
        fontSize: 18,
        color: '#666',
        marginBottom: 15,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
