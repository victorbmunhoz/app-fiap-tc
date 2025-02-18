import api from './api';
import * as SecureStore from 'expo-secure-store';

// Função para obter o token
const getAuthHeader = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    return { Authorization: `Bearer ${token}` };
};


// 🔹 **Buscar todos os posts (Home)**
export const getAllPosts = async () => {
    const headers = await getAuthHeader();
    const response = await api.get('/posts', { headers });
    return response.data;
};

// 🔹 **Buscar posts do professor logado**
export const getPostsByTeacher = async (teacherId) => {
    try {
        // Buscar todos os posts
        const response = await getAllPosts();

        // Filtrar apenas os posts do professor pelo authorId
        const teacherPosts = response.filter(post => post.authorId === teacherId);

        return teacherPosts;
    } catch (error) {
        console.error('❌ Erro ao buscar posts do professor:', error);
        throw error;
    }
};

// 🔹 **Buscar um post específico**
export const getPostById = async (postId) => {
    const headers = await getAuthHeader();
    const response = await api.get(`/posts/${postId}`, { headers });
    return response.data;
};

// 🔹 **Criar um novo post**
export const createPost = async (postData) => {
    const headers = await getAuthHeader();
    const response = await api.post('/posts', postData, { headers });
    return response.data;
};

// 🔹 **Atualizar um post existente**
export const updatePost = async (postId, postData) => {
    const headers = await getAuthHeader();
    const response = await api.put(`/posts/${postId}`, postData, { headers });
    return response.data;
};

// 🔹 **Excluir um post**
export const deletePost = async (postId) => {
    const headers = await getAuthHeader();
    const response = await api.delete(`/posts/${postId}`, { headers });
    return response.data;
};
