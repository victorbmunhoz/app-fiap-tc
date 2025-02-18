import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { getAllPosts } from '../services/postService';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Buscar posts ao carregar a tela
    useEffect(() => {
        fetchPosts();
    }, []);

    // Função para buscar posts
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await getAllPosts();
            setPosts(response);
        } catch (error) {
            console.error('⚠️ Erro ao buscar posts:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Recarregar posts sempre que a tela for focada
    useFocusEffect(
        React.useCallback(() => {
            fetchPosts();
        }, [])
    );

    // Função para atualizar os posts com pull-to-refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    // Renderizar cada post na lista
    const renderPost = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
            activeOpacity={0.7}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>Autor: {item.authorName}</Text>
            <Text numberOfLines={3} style={styles.content}>{item.content}</Text>
            <Text style={styles.date}>
                📆 {new Date(item.createdAt).toLocaleDateString('pt-BR')}
            </Text>
            <Text style={styles.readMore}>🔍 Ler mais...</Text>
        </TouchableOpacity>
    );

    // Exibir carregando
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Carregando posts...</Text>
            </View>
        );
    }

    // Exibir lista de posts
    return (
        <View style={styles.container}>
            {posts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum post encontrado.</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPost}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6EAF0',
        padding: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6EAF0',
    },
    loadingText: {
        marginTop: 10,
        color: '#555',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#777',
        fontSize: 18,
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginVertical: 12,
        padding: 18,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3E50',
        marginBottom: 6,
    },
    author: {
        fontSize: 14,
        color: '#6C757D',
        marginBottom: 6,
    },
    content: {
        fontSize: 16,
        color: '#4A5568',
        marginBottom: 10,
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginBottom: 6,
        fontStyle: 'italic',
    },
    readMore: {
        marginTop: 6,
        color: '#007BFF',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'right',
    },
});

export default HomeScreen;
