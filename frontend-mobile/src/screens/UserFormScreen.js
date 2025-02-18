import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { createUser, updateUser } from '../services/userService';

// Componente principal
const UserFormScreen = ({ route, navigation }) => {
    const { user } = route.params || {};
    const isEditing = !!user;

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(user?.role === 'student' ? 'Estudante' : user?.isAdmin ? 'Professor Administrador' : 'Professor');
    const [loading, setLoading] = useState(false);

    // Função para alternar a função selecionada
    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
    };

    // Validação básica dos campos
    const validateFields = () => {
        if (!name.trim() || !email.trim() || (!isEditing && !password.trim()) || !role) {
            Alert.alert('❌ Erro', 'Preencha todos os campos corretamente!');
            return false;
        }
        if (!email.includes('@')) {
            Alert.alert('❌ Erro', 'Digite um email válido!');
            return false;
        }
        return true;
    };

    // Função para salvar (criar ou editar)
    const handleSave = async () => {
        if (!validateFields()) return;

        const userData = {
            name,
            email,
            password: password || user?.password,
            role: role === 'Estudante' ? 'student' : 'teacher',
            isAdmin: role === 'Professor Administrador',
        };

        setLoading(true);
        try {
            if (isEditing) {
                await updateUser(user.id, userData);
                Alert.alert('✅ Sucesso', 'Usuário atualizado com sucesso!');
            } else {
                await createUser(userData);
                Alert.alert('✅ Sucesso', 'Usuário criado com sucesso!');
            }
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            Alert.alert('❌ Erro', 'Não foi possível salvar o usuário.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.title}>{isEditing ? '🖊️ Editar Usuário' : '🆕 Criar Novo Usuário'}</Text>

            {/* Nome */}
            <Text style={styles.label}>Nome:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome"
                placeholderTextColor="#999"
            />

            {/* Email */}
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite o email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
            />

            {/* Senha (apenas ao criar) */}
            {!isEditing && (
                <>
                    <Text style={styles.label}>Senha:</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Digite a senha"
                        secureTextEntry
                        placeholderTextColor="#999"
                    />
                </>
            )}

            {/* Seletor de Função */}
            <Text style={styles.label}>Função:</Text>
            <View style={styles.roleSelector}>
                {['Estudante', 'Professor', 'Professor Administrador'].map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.roleButton,
                            role === option && styles.selectedRoleButton
                        ]}
                        onPress={() => handleRoleChange(option)}
                    >
                        <Text style={role === option ? styles.selectedRoleText : styles.roleText}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Botão de Salvar */}
            <TouchableOpacity
                style={[styles.saveButton, loading && styles.disabledButton]}
                onPress={handleSave}
                disabled={loading}
            >
                <Text style={styles.saveButtonText}>
                    {loading ? 'Salvando...' : isEditing ? '💾 Salvar Alterações' : '🆕 Criar Usuário'}
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default UserFormScreen;

// Estilização aprimorada
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f6f7',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2c3e50',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        color: '#34495e',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginVertical: 10,
        fontSize: 16,
        color: '#2c3e50',
    },
    roleSelector: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginVertical: 20,
        gap: 10,
    },
    roleButton: {
        backgroundColor: '#ecf0f1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        minWidth: 100,
        alignItems: 'center',
    },
    selectedRoleButton: {
        backgroundColor: '#007BFF',
        borderColor: '#0056b3',
    },
    roleText: {
        color: '#34495e',
        fontWeight: '500',
    },
    selectedRoleText: {
        color: '#fff',
        fontWeight: '600',
    },
    selectedRole: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        fontWeight: '500',
        color: '#2980b9',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#95a5a6',
    }
});
