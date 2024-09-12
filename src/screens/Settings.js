import React, { useState,useEffect,useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Profilepage from './Profilepage';
import About from './About';
import { AntDesign } from '@expo/vector-icons';

import { createStackNavigator } from '@react-navigation/stack';
import { API_SERVER_URL, API_SERVER_SOCKET } from './config';


const Stack = createStackNavigator();

const Settings = (props) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('JohnDoe'); // Example username
  const [profileImage, setProfileImage] = useState(null);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => navigation.navigate('Home')}
        >
        <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
      )
    });
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Handle save functionality
  };

  const handleProfilePress = async () => {
    // Request permission to access the gallery
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access gallery is required!');
      return;
    }

    // Open the image picker
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfileImage(pickerResult.uri); // Update profile image locally
      uploadImage(pickerResult.uri); // Upload image to server
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('photo', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch(`${API_SERVER_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Profile photo uploaded successfully');
      } else {
        Alert.alert('Error', 'Failed to upload profile photo');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload profile photo');
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authtoken');
        if (token) {
          const response = await axios.get(`${API_SERVER_URL}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          if (userData && userData.username && userData.doctorid) {
            setDoctorID(userData.doctorid);
            setUser(userData.username);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
       
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Picture</Text>
        <TouchableOpacity style={styles.imageContainer} onPress={handleProfilePress}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}> {user && user[0]}</Text>
            </View>
          )}
          <Text style={styles.optionText}>Change Photo</Text>
          
        </TouchableOpacity>
      </View>

      {/* Display Name */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Name</Text>
        <TextInput style={styles.input} placeholder="Enter your name" value={user} onChangeText={setUser} />
      </View>

      {/* Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bio</Text>
        <TextInput style={styles.input} placeholder="Write a short bio" multiline />
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <TextInput style={styles.input} placeholder="Enter your email" />
        <TextInput style={styles.input} placeholder="Enter your phone number" />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#119988',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginLeft: 30,
    color: '#119988',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  placeholderContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 40,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#119988',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#119988',
  },
});

export default function Newnav() {
  return (
    <Stack.Navigator>
    <Stack.Screen 
      name="Settings" 
      component={Settings} 
      options={{ headerShown: true }} 
    />
    <Stack.Screen 
      name="Profilepage" 
      component={Profilepage} 
      options={{ headerShown: true }} 
    />
    <Stack.Screen 
      name="About" 
      component={About} 
      options={{ headerShown: true }} 
    />
  </Stack.Navigator>
  );
}
