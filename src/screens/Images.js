import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView } from 'react-native';

const Images = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_SERVER_URL}/getAllImages`);
        if (response.ok) {
          const imageData = await response.json();
          setImages(imageData);
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const renderImage = async (id, mimetype) => {
    try {
      const response = await fetch(`${API_SERVER_URL}/getImage/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const uri = URL.createObjectURL(blob);
        return { uri, mimetype };
      } else {
        console.error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.length > 0 ? (
        images.map(async (image) => {
          const { uri } = await renderImage(image.id, image.mimetype);
          return (
            <View key={image.id} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <Text>ID: {image.id}</Text>
            </View>
          );
        })
      ) : (
        <Text>No images available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default Images;
