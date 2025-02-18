import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PostDetailScreen = ({ route }) => {
    const { post } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Título */}
            <Text style={styles.title}>{post.title}</Text>

            {/* Autor */}
            <View style={styles.infoContainer}>
                <Text style={styles.label}>👤 Autor:</Text>
                <Text style={styles.author}>{post.authorName}</Text>
            </View>

            {/* Conteúdo */}
            <Text style={styles.content}>{post.content}</Text>

            {/* Data de Criação */}
            <Text style={styles.date}>
                📅 Criado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F0F2F5',
        borderRadius: 12,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 10,
        padding: 12,
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    author: {
        fontSize: 18,
        color: '#333',
        marginTop: 4,
    },
    content: {
        marginTop: 15,
        fontSize: 16,
        color: '#444',
        textAlign: 'justify',
        lineHeight: 24,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderColor: '#E5E7EB',
        borderWidth: 1,
    },
    date: {
        marginTop: 20,
        fontSize: 14,
        color: '#6B7280',
        fontStyle: 'italic',
        textAlign: 'right',
    },
});

export default PostDetailScreen;
