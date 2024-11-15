import React, { useRef, useState } from 'react';
import { SafeAreaView, TextInput, Text, View, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ServicesContext } from '../context/ServicesContext';
import { generateRandomPassword } from '../utils/utils';
import { validateUrl } from '../utils/utils';
import styles from '../styles/Styles'; //Estilo da tela
import Slider from '@react-native-community/slider';

const HomeScreen = ({ navigation }) => {
  const {saveService } = React.useContext(ServicesContext); //usando o contexto 
  
  // Declaração dos estados
  const [service, setService] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordLength, setPasswordLength] = useState(12);
  const debounceRef = useRef(null); //debounce é uma técnica usada para limitar o número de vezes que uma função é chamada durante um determinado período de tempo

  const handleSave = () => {
    if(!service || !username || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if(url && !validateUrl(url)) {
      Alert.alert("Erro", "Por favor, insira uma URL válida.");
      return;
    }

    const newService = { 
      service,
      entries: [{ url, username, password, note }]
    };
    saveService(newService); //Salva o serviço usando o contexto;
    
    //Limpa os campos
    setService('');
    setUrl('');
    setUsername('');
    setPassword('');
    setNote('');
    
    Alert.alert("Sucesso", "Serviço salvo com sucesso!");
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(passwordLength);
    setPassword(newPassword); //atualiza o estado com a senha gerada
  };

  const handleSliderChange = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPasswordLength(Math.round(value)); //Atualiza o valor com debounce
    }, 200); //espera 200ms após o usuário parar de mexer no slider
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" 
        >
            <View style={styles.inputContainer}>
              <Icon name="server" size={20} color="#999" style={styles.iconInput}/>
              <TextInput
                style={styles.input}
                placeholder="Serviço*"
                value={service}
                onChangeText={setService} 
              />
            </View>
            <View style={[styles.inputContainer, !validateUrl(url) && styles.inputError]}>
              <Icon name="globe" size={20} color="#999" style={styles.iconInput}/>
              <TextInput
                style={styles.input}
                placeholder="URL"
                value={url}
                onChangeText={setUrl} 
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#999" style={styles.iconInput}/>
              <TextInput
                style={styles.input}
                placeholder="Usuário*"
                value={username}
                onChangeText={setUsername} 
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#999" style={styles.iconInput} />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Senha*"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setPasswordVisible(!passwordVisible)} // Alterna a visibilidade da senha
                >
                  <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Tamanho da Senha: {passwordLength}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={8} // valor mínimo do slider
                  maximumValue={32} // valor máximo do slider
                  step={1} // Passo de 1 unidade
                  value={passwordLength}
                  onValueChange={handleSliderChange} // Atualiza o estado com o valor selecionado
                  minimumTrackTintColor="#3498db" // Cor do mínimo
                  maximumTrackTintColor="#999" // Cor do máximo
                  thumbTintColor="#3498db" // Cor do thumb
                  thumbStyle={{ width: 20, height: 20 }}
                />
                {/* Botão de Gerar Senha */}
                <TouchableOpacity style={styles.button} onPress={handleGeneratePassword}>
                  <Text style={styles.buttonText}>Gerar Senha</Text>
                </TouchableOpacity>
              </View>
            </View>
            
              {/* Campo de Note */}
              <View style={styles.inputContainer}>
                <Icon name="pencil" size={20} color="#999" style={styles.iconInput} />  
                <TextInput
                  style={styles.input}
                  placeholder="Nota"
                  value={note}
                  onChangeText={setNote} // Atualiza o estado quando o texto muda
                />
              </View>

              {/* Botão de Salvar */}
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
        </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

