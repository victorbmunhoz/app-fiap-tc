import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { createPost, updatePost } from '../services/postService';

const PostFormScreen = ({ route, navigation }) => {
    const { user } = useAuth();
    const { post } = route.params || {}; // Se não houver post, estamos criando
    const isEditing = !!post;

    // Estado para título e conteúdo
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');
    const [loading, setLoading] = useState(false);

    // Validação básica
    const validateFields = () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return false;
        }
        return true;
    };

    // Função para salvar (criar ou editar)
    const handleSave = async () => {
        if (!validateFields()) return;

        const postData = {
            title,
            content,
            authorId: user.id,
            authorName: user.name
        };

        setLoading(true);
        try {
            if (isEditing) {
                await updatePost(post.id, { title, content });
                Alert.alert('✅ Sucesso', 'Post atualizado com sucesso!');
            } else {
                await createPost(postData);
                Alert.alert('✅ Sucesso', 'Novo post criado com sucesso!');
            }
            navigation.goBack();
        } catch (error) {
            console.error('❌ Erro ao salvar post:', error);
            Alert.alert('Erro', 'Não foi possível salvar o post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>{isEditing ? '🖊️ Editar Post' : '🆕 Criar Novo Post'}</Text>

                {/* Campo de Título */}
                <Text style={styles.label}>Título:</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Digite o título do post"
                />

                {/* Campo de Conteúdo */}
                <Text style={styles.label}>Conteúdo:</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Digite o conteúdo do post"
                    multiline
                    numberOfLines={6}
                />

                {/* Botão de Salvar */}
                <Button
                    title={loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Post'}
                    onPress={handleSave}
                    color="#007BFF"
                    disabled={loading}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PostFormScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollView: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#555',
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
});
