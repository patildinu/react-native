
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateDeliveryPerson, postUserInfo } from '../controler/ServiceManager';

const UserLogin = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading

  // Helper function to validate email
  const isGmail = (email) => {
    return email.endsWith('@gmail.com');
  };

  // Handler for login
  const handleLogin = async () => {
    if (!isGmail(username)) {
      Alert.alert('Invalid Email', 'Enter the proper gmail');
      return;
    }

    try {
      if (username && password) {
        setLoading(true); // Start loading
        const isValid = await validateDeliveryPerson(username, password); // Call API for validation
        if (isValid) {
          navigation.navigate('Home'); // Navigate to HomePage on successful login
        } else {
          Alert.alert('Login Failed', 'Invalid email or password.');
        }
      } else {
        Alert.alert('Login Failed', 'Please enter both email and password.');
      }
    } catch (error) {
      Alert.alert('Login Error', 'An error occurred during login.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handler for signup
  const handleSignUp = async () => {
    if (!isGmail(username)) {
      Alert.alert('Invalid Email', 'Email should end with @gmail.com');
      return;
    }

    if (username && password) {
      try {
        setLoading(true); // Start loading
        const result = await postUserInfo(username, password);
        if (result) {
          Alert.alert('SignUp Successful', 'Your account has been created.');
          setIsSignUp(false); // Switch back to login view
        } else {
          Alert.alert('SignUp Successful', 'Your account has been created.');
        }
      } catch (error) {
        Alert.alert('SignUp Error', 'An error occurred during SignUp.');
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      Alert.alert('SignUp Failed', 'Please enter both email and password.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.loginPage}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.buttonContainer}>
            {loading && (
              <ActivityIndicator size="large" color="#04B56C" style={styles.spinner} />
            )}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonBlur]}
              onPress={isSignUp ? handleSignUp : handleLogin}
              disabled={loading} // Disable the button when loading
            >
              <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp);
              setUsername('');
              setPassword('');
            }}
          >
            <Text style={styles.signUpText}>
              {isSignUp ? 'Back to Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPage: {
    width: '95%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  inputText: {
    width: '100%',
    padding: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 15,
  },
  buttonContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#04B56C',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonBlur: {
    opacity: 0.5, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#007BFF',
    fontSize: 16,
    marginTop: 10,
  },
  spinner: {
    position: 'absolute', 
    top: '50%',
    left: '50%',
    marginLeft: -12, 
    marginTop: -12, 
  },
});

export default UserLogin;


