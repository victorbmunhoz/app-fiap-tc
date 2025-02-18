import * as SecureStore from 'expo-secure-store';

// Função para salvar o token
export async function saveToken(token) {
    try {
        await SecureStore.setItemAsync('userToken', token);
        console.log('🔒 Token salvo com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao salvar o token:', error);
    }
}

// Função para recuperar o token
export async function getToken() {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            console.log('🔑 Token recuperado:', token);
            return token;
        }
        return null;
    } catch (error) {
        console.error('❌ Erro ao recuperar o token:', error);
        return null;
    }
}

// Função para remover o token
export async function removeToken() {
    try {
        await SecureStore.deleteItemAsync('userToken');
        console.log('🗑️ Token removido com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao remover o token:', error);
    }
}
