import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert,Button } from 'react-native';
import Modal from 'react-native-modal';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {createStackNavigator} from '@react-navigation/stack';

import { API_SERVER_URL } from './config';
import axios from 'axios';

const uploadFile = async (fileData) => {
  try {
    const response = await axios.post(`${API_SERVER_URL}/upload`, fileData);
    console.log(response.data); // Output server response
    // Handle response from server
  } catch (error) {
    console.error('Error uploading file:', error);
    // Handle error
  }
};

// Call the uploadFile function with file data
// For example:
const fileData = {
  // Include file data here
};
uploadFile(fileData);


const Uploadreport = ({navigation}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [image, setImage] = useState(null);

  const handleUploadPress = () => {
    setIsDrawerVisible(true);
  };

// Function to handle selecting a file from device storage
const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
    });

    if (result.type === 'success') {
      // Handle the picked document
      console.log(result.uri);
    } else if (result.type === 'cancel') {
      console.log('Document picking cancelled');
    }
  } catch (error) {
    console.error('Error picking document:', error);
  }
};

 // Function to handle capturing photo using the camera
const handleTakePhoto = async () => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      // Call upload function here if you want to upload the taken photo immediately
    }
  } catch (error) {
    console.error('Error taking photo:', error);
  }
};

  
   // upload  image from gallery

   const handleChooseFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: undefined,
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        setImage(imageUri); // Set the image URI to state
        
        const formData = new FormData();
        formData.append('fileName', {
          uri: imageUri,
          type: 'image/*', // Adjust the mime type according to your image type
          name: 'image.png', // Adjust the file name if needed
        });
  
        const response = await axios.post(`${API_SERVER_URL}/uploadImage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log('Image uploaded successfully:', response.data);
      }
    } catch (error) {
      console.error('Error choosing from gallery:', error);
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('fileName', {
        uri: image,
        type: 'image/*', // Adjust the mime type according to your image type
        name:"image.png" , // Adjust the file name if needed
      });

      const response = await axios.post(`${API_SERVER_URL}/uploadImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  


  const handleOptionSelect = (selectedOption) => {
    setIsDrawerVisible(false);
    if (selectedOption === 'takePhoto') {
      handleTakePhoto();
    } else if (selectedOption === 'uploadGallery') {
      handleChooseFromGallery();
    } else if (selectedOption === 'uploadFiles') {
      pickDocument();
    }
  };

  return (
    <View>
      <View style={styles.box}>
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100,}} />}
      {image && (
        <Button
          title="image"
          onPress={uploadImage}
        />
      )}
        <View style={styles.boxx}>
          <View style={styles.box2}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
              Add a medical record.
            </Text>
            <Text style={styles.text}>
              A detailed health history helps a doctor diagnose you better.
            </Text>
            <TouchableOpacity style={styles.vurbox}>
              <Text onPress={() => navigation.navigate('Images')}>View uploaded Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadbox} onPress={handleUploadPress}>
              <Text>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          isVisible={isDrawerVisible}
          onBackdropPress={() => setIsDrawerVisible(false)}
          onBackButtonPress={() => setIsDrawerVisible(false)}
          style={styles.drawer}
        >
          <View style={styles.drawerContent}>
          <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleOptionSelect('takePhoto')}
        >
              <Text>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => handleOptionSelect('uploadGallery')}
            >
              <Text>Upload from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => handleOptionSelect('uploadFiles')}
            >
              <Text>Upload Files</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Uploadreport;

const styles = StyleSheet.create({
  boxx: {
    alignItems: 'center',
    top: 30,
    rowGap: 50,
  },
  vurbox: {
    backgroundColor: '#996633',
    alignItems: 'center',
    height: 40,
    width: 180,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  box: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  box1: {
    top: 30,
  },
  box2: {
    top: 40,
    alignItems: 'center',
    rowGap: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
  },
  uploadbox: {
    backgroundColor: '#0EBE7F',
    alignItems: 'center',
    height: 40,
    width: 150,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  drawer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  drawerContent: {
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
});
