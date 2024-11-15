import React, { useState, useEffect, useRef } from 'react';
import { FlatList, View, Text, SafeAreaView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ServicesContext } from '../context/ServicesContext';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Clipboard from 'expo-clipboard';
import { generateRandomPassword } from '../utils/utils';
import styles from '../styles/Styles';
import * as SecureStore from "expo-secure-store";
import Slider from '@react-native-community/slider';

const ServicesListScreen = () => {
  const { 
    services,
    expandedItem,
    setExpandedItem,
    deleteService,
    updateService 
  } = React.useContext(ServicesContext); 

  const [passwordVisible, setPasswordVisible] = useState(false); //controla a visiblidade da senha 
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newNote, setNewNote] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const debounceRef = useRef(null);
  
  
  //solicitar autenticação e exibir a senha
  const handleViewPassword = async (password) => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para ver a senha',
        fallbackLabel: 'Usar PIN',
        cancelLabel: 'Cancelar',
      });

      if(result.success) {
        //exibe a senha em um alert com icone de copiar
        Alert.alert(
          'Senha',
          password,
          [
            {
              text: 'Copiar',
              onPress: () => {
                Clipboard.setStringAsync(password); //Copia a senha
                Alert.alert('Sucesso', 'senha copiada para a área de transferência');
              }
            },
            { text: 'Fechar' }
          ],
          { cancelable: true}
        );
      } else {
        Alert.alert('Erro', 'Autenticação falhou. Tente novamente.');
      }
    } catch(error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar autenticar');
    }
  };

  //solicitar autenticação e excluir o serviço inteiro
  const authenticate = async(actionType, serviceName, entry) => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para prosseguir', 
        fallbackLabel: 'Usar PIN',
      });

      if (result.success) {
        if(actionType === 'deleteService') {
          Alert.alert(
            'Confirmar Exclusão de Serviço',
            `Você tem certeza que deseja excluir o serviço: ${serviceName}? O processo é irreversível!`,
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Excluir',
                onPress: () => deleteService(serviceName),
              },
            ],
            { cancelable: false }
          );

        } else if(actionType === 'deleteLogin') {
          Alert.alert(
            'Confirmar Exclusão de Login',
            `Você tem certeza que deseja excluir o login do usuário: ${entry.username}? O processo é irreversível!`,
            [
              {
                text: 'Cancelar',
                style: 'cancel'
              },
              {
                text: 'Excluir',
                onPress: () => deleteService(serviceName, entry.username),
              },
            ],
            { cancelable: false }
          );
        } else if(actionType == 'editLogin') {
          const serviceToEdit = services.find(service => service.service === serviceName);
          if (serviceToEdit) {
            setEditingService(serviceName);
            setNewUsername(entry.username);
            setNewPassword(entry.password);
            setNewNote(entry.note)
            setModalVisible(true);
          } else {
            Alert.alert('Erro', 'Serviço não encontrado');
          }
           
        } 
      } else {
        Alert.alert('Erro', 'Autenticação falhou. Tente novamente.');
      }
    } catch(error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar autenticar');
    }
  };

  const handleSliderChange = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPasswordLength(Math.round(value));
    }, 200);
  };

  const handleSaveEdit = async () => {
    if(!newUsername || !newPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    //Atualiza diretamente o login no serviço que estamos editando
    const updatedServices = services.map(service => {
      if(service.service === editingService) {
        const updatedEntries = service.entries.map(entry => {
          if(entry.username === newUsername) {
            return {
              ...entry,
              username: newUsername,
              password: newPassword,
              note: newNote,
            };
          }
          return entry;
        });

        return {
          ...service,
          entries: updatedEntries,
        };
      }
      return service;
    });

    //atualiza o estado e AsyncStorage
    await updateService(updatedServices);
    SecureStore.setItemAsync('services', JSON.stringify(updatedServices));

    Alert.alert("Sucesso", "Login atualizado com sucesso!");
    setModalVisible(false);

  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <TouchableOpacity
          style={styles.listHeaderButton} 
          onPress={() => setExpandedItem(expandedItem === item.service ? null : item.service)}>
          <Icon name={expandedItem === item ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
          <Text style={styles.listItemText}>{item.service}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => authenticate('deleteService', item.service)}>
          <Icon name="trash" size={20} color="#000" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {/* Exibe os logins quando o serviço for expandido */}
      {expandedItem === item.service && item.entries && (
        <View style={styles.entriesContainer}>
          {item.entries.map((entry, index) => (
            <View key={`${item.service}_${entry.username}_${index}`} style={styles.entry}>
              <Text style={styles.listText}>URL: {entry.url}</Text>
              <Text style={styles.listText}>Usuário: {entry.username}</Text>
              <Text style={styles.listText}>Nota: {entry.note}</Text>
              
              
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleViewPassword(entry.password)} 
                >
                  <Icon name="unlock" size={20} color="#fff" style={styles.icon} />
                  <Text style={styles.serviceButtonText}>Visualizar senha</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    authenticate('editLogin', item.service, entry); //autenticação
                  }}
                  >
                    <Icon name="edit" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.serviceButtonText}>Editar Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => authenticate('deleteLogin', item.service, entry)}
                >
                  <Icon name="trash" size={20} color="#fff" style={styles.icon} />
                  <Text style={styles.serviceButtonText}>Excluir Login</Text>
                </TouchableOpacity>
              </View>
            
          ))}
        </View>
      )}
    </View>
  );
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <FlatList
              data={services}
              keyExtractor={(item) => `${item.service}`} //chave única
              renderItem={renderItem}
          />

          
          <Modal
            visible={modalVisible}
            animationType='slide'
            onRequestClose={() => setModalVisible(false)}
          >
            <SafeAreaView style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView 
                  contentContainerStyle={styles.scrollContainer}
                  keyboardShouldPersistTaps="handled" 
                >
                  <Text style={styles.modalTitle}>Editar Login</Text>

                  <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#999" style={styles.iconInput}/>
                    <TextInput
                      style={styles.input}
                      placeholder="Usuário"
                      value={newUsername}
                      onChangeText={setNewUsername}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#999" style={styles.iconInput}/>
                    <View style={styles.passwordContainer}>
                      <TextInput 
                        style={styles.passwordInput}
                        placeholder="Password"
                        value={newPassword}
                        secureTextEntry={!passwordVisible}
                        onChangeText={setNewPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      >
                        <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <View style={styles.sliderContainer}>
                      <Text style={styles.sliderLabel}>Tamanho da senha: {passwordLength}</Text>
                      <Slider 
                        style={styles.slider}
                        minimumValue={8}
                        maximumValue={32}
                        step={1}
                        value={passwordLength}
                        onValueChange={handleSliderChange}
                        minimumTrackTintColor="#3498db"
                        maximumTrackTintColor="#ecf0f1"
                        thumbTintColor="#3498db"
                        thumbStyle={{width: 20, height: 20}}
                      /> 
                      <TouchableOpacity
                      style={styles.button}
                      onPress={() => setNewPassword(generateRandomPassword(passwordLength))}
                    >
                      <Text style={styles.buttonText}>Gerar Senha</Text>
                    </TouchableOpacity> 
                    </View>
                  
                  </View>
                  

                  <View style={styles.inputContainer}>
                    <Icon name="pencil" size={20} color="#999" style={styles.iconInput}/>
                    <TextInput
                      style={styles.input}
                      placeholder="Nota"
                      value={newNote}
                      onChangeText={setNewNote}
                    />
                  </View>
                  

                  <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
                    <Text style={styles.buttonText}>Salvar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </ScrollView>
              </TouchableWithoutFeedback>
            </SafeAreaView>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

export default ServicesListScreen;
