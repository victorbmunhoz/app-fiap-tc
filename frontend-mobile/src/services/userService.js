// src/services/userService.js
import api from './api';
import * as SecureStore from 'expo-secure-store';

// Função para obter o cabeçalho de autenticação
const getAuthHeader = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    return { Authorization: `Bearer ${token}` };
};

// Buscar todos os usuários (professores e estudantes)
export const getAllUsers = async () => {
    const headers = await getAuthHeader();
    const [teachers, students] = await Promise.all([
        api.get('/teachers', { headers }),
        api.get('/students', { headers })
    ]);
    const teacherList = teachers.data.map((u) => ({ ...u, role: 'teacher' }));
    const studentList = students.data.map((u) => ({ ...u, role: 'student' }));
    return [...teacherList, ...studentList];
};

// Criar usuário
export const createUser = async (userData) => {
    const headers = await getAuthHeader();
    const endpoint = userData.role === 'student' ? '/students' : '/teachers';
    const response = await api.post(endpoint, userData, { headers });
    return response.data;
};

// Atualizar usuário
export const updateUser = async (userId, userData) => {
    const headers = await getAuthHeader();
    const endpoint = userData.role === 'student' ? `/students/${userId}` : `/teachers/${userId}`;
    const response = await api.put(endpoint, userData, { headers });
    return response.data;
};

// Excluir usuário
export const deleteUser = async (userId, role) => {
    const headers = await getAuthHeader();
    const endpoint = role === 'student' ? `/students/${userId}` : `/teachers/${userId}`;
    const response = await api.delete(endpoint, { headers });
    return response.data;
};
