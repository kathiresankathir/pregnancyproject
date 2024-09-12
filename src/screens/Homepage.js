import React, {useState, useEffect, useLayoutEffect,useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  onPress,
  Button,
  ScrollView,
  RefreshControl,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SVGImg from '../images/img1.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import ParallaxLayer from './Parallaxlayers';
import {API_SERVER_URL} from './config';
import { Entypo } from '@expo/vector-icons';
import {createStackNavigator} from '@react-navigation/stack';

import NoResultsIndicator from './NoResultsIndicator';

import PatientDetails from './PatientDetails';
import Addreports from './Addreport';
import PatientList from './PatientList';
// import Anemiapageone from './Anemiapageone';
// import Anemiapagetwo from './Anemiapagetwo';
// import Hyperpageone from './Hyperpageone';
// import Generalpage from './Generalpage';
// import Hyperpagetwo from './Hyperpagetwo';
// import PropTypes from 'deprecated-react-native-prop-types';
import { MaterialCommunityIcons,AntDesign } from '@expo/vector-icons';
import { Octicons,FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import socketIOClient from 'socket.io-client';
import {ActivityIndicator} from 'react-native';

import axios from 'axios';
import Categories from './Categories';
import {API_SERVER_SOCKET} from './config';
import fontLoader from './fontLoader';
const Stack = createStackNavigator();

const Homepage = React.memo(({navigation,props}) => {
  const [doctorID, setDoctorID] = useState(null);
  const [image, setImage] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false); // New state variable

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);
  
  // useEffect(() => {
  //   const fetchRecentlyViewed = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('authtoken');
  //       if (token) {
  //         const response = await axios.get(`${API_SERVER_URL}/user`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         console.log('Doctor ID:', response.data.doctorID);
  //         const doctorID = response.data.doctorID;
         
  //         setDoctorID(doctorID);
  
  //         // Fetch recently viewed patient IDs from AsyncStorage
  //         const recentlyViewedData = await AsyncStorage.getItem('recentlyViewed');
  //         if (recentlyViewedData && doctorID) {
  //           const recentlyViewedPatients = JSON.parse(recentlyViewedData);
  
  //           // Fetch patient list for the doctor from the MySQL database
  //           const patientListResponse = await axios.get(`${API_SERVER_URL}/patients?doctorID=${doctorID}`);
  //           const patientList = patientListResponse.data;
  
  //           // Filter and sort the recently viewed patients
  //           const validRecentlyViewed = recentlyViewedPatients.filter(recentPatient =>
  //             patientList.some(patient =>
  //               patient._id === recentPatient._id && !patient.isDeleted
  //             )
  //           );
  //           const sortedData = validRecentlyViewed.sort((a, b) => {
  //             const timeDifferenceA = Math.floor((currentTime - new Date(a.timestamp)) / (1000 * 60));
  //             const timeDifferenceB = Math.floor((currentTime - new Date(b.timestamp)) / (1000 * 60));
  //             return timeDifferenceA - timeDifferenceB;
  //           });
  
  //           setRecentlyViewed(sortedData);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching recently viewed patients:', error);
  //     }
  //   };

  
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 5000);
  
  //   fetchRecentlyViewed();
  
  //   return () => clearInterval(intervalId);
  // }, []);
  
  
  const [user,setUser]= useState(null);

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

  // const socket = socketIOClient(`${API_SERVER_SOCKET}`);
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
  
  //image upload from gallery

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
    // setIsDrawerVisible(false);
    if (selectedOption === 'takePhoto') {
      handleTakePhoto();
    } else if (selectedOption === 'uploadGallery') {
      handleChooseFromGallery();
    } else if (selectedOption === 'uploadFiles') {
      pickDocument();
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [doctorID, setDoctorID] = useState(null);
  const socket = socketIOClient(`${API_SERVER_SOCKET}`);

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredPatients(filtered);
  };

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
          console.log('Doctor ID:', response.data.doctorid);
          const doctorID = response.data.doctorid;
          setDoctorID(doctorID);

          if (doctorID !== null && patients.length === 0) {
            const response = await axios.get(
              `${API_SERVER_URL}/patients?doctorID=${doctorID}`,
            );
            setPatients(response.data);
            setFilteredPatients(response.data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };
    fetchData();
  
   socket.on('new-patient', newPatient => {
  // Check if the newPatient is not already in the patients list
  if (!patients.find(patient => patient._id === newPatient._id)) {
    setPatients(prevPatients => [...prevPatients, newPatient]);
    setFilteredPatients(prevPatients => [...prevPatients, newPatient]);
  }
});
    return () => {
      socket.disconnect();
    };
  }, []);
  

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${API_SERVER_URL}/patients?doctorID=${doctorID}`,
      );
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.log('Error fetching patients:', error);
    } finally {
      setRefreshing(false);
    }
  };
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.homescreen}>
        <View style={styles.header}>
         <View style={styles.profile}>
          <Text style={{ color: '#119988', fontSize: 32, fontWeight: 'bold' }}>
           {user && user[0]}
           </Text>
          </View> 
         <Text style={{fontWeight:'bold',fontSize:18}}>Hi.. <MaterialCommunityIcons name="hand-wave-outline" size={24} color="white"/> {user}</Text> 
         <View >
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
             <Octicons name="three-bars" size={24} color="black" />
            </TouchableOpacity>
         </View>       
        </View>
       <View>
         <View style={{flexDirection:'column'}}>
           <View style={styles.search}>
                <TextInput
                  placeholder="Search patient"
                  placeholderTextColor="#2f2f2f"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  style={styles.input}
                />
                <FontAwesome
                  style={styles.seicon}
                  name="search"
                  size={24}
                  color="#199999"
                />
           </View>
            <View style={{top:20}}>
                <View style={styles.hader}>    
                </View>
                <ParallaxLayer/> 
            </View>
            
            <View style={{top:175}}>
              <Text style={{fontWeight:'bold',fontSize:18}} >Categorie</Text>
              <Categories/>
              </View>
         </View>
          <View style={styles.recentlyViewedContainer}>
         <Text style={styles.recentlyViewedTitle}>Recently Viewed Patients...   
         <Entypo name="back-in-time" size={20} color="black" /></Text>
       <View>
        <View style={styles.list}>
          {loading ? (
            <ActivityIndicator size="large" color="#119988" />
          ) : filteredPatients.length === 0 ? (
            <NoResultsIndicator />
          ) : (
            <FlatList
              style={styles.sv}
              data={filteredPatients}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.listbox}
                  // onPress={() =>
                  //   navigation.push('PatientDetails', {patient: item})
                  // }
                  >
                  <View style={styles.listitem}>
                    <View style={styles.cir}>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        {item.name[0].toUpperCase()}
                      </Text>
                    </View>
                  </View> 

                  <View style={styles.patientcontent}>
                    <View style={{flexDirection:"row"}}>
                    <Text style={[styles.tcontent, styles.text]}> {item.name} </Text>
                    </View>
                    
                    <Text style={{color:"#14b8a5"}}> P_Id :({item.patientid})</Text>
                  </View>
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </View>
      </View>
      </View>
      </View>
    </View>
    </SafeAreaView>
  );
});
export default function Kathi() {
  return (
    <Stack.Navigator
      initialRouteName="Homepage"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Homepage"  component={Homepage} />
      <Stack.Screen name="PatientDetails" component={PatientDetails}/>
      <Stack.Screen name="PatientList" component={PatientList}/>
      <Stack.Screen name="Addreports" component={Addreports}  />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  recentlyViewedItemText:{
   fontSize:16
  },
  recentlyViewedTitle: {
    fontSize: 18,
    fontWeight:'bold',
  },
  recentlyViewedContainer: {
  //   padding: 20,
  top:300,
  //   backgroundColor: '#fff',
  //   margintop: 200,
  //   height:"56%",
  //   borderRadius: 20,
  },
  timestamp: {
    color: 'red',
    fontSize:16
  },
  time: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 15,
  },
  imagebox: {
    height: 350,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    top: 20,
    padding: 30,
    borderRadius: 20,
  },
  imagelogo: {
    width: 300,
    height: 338,
  },
  arr: {
    top: 57,
    left: 10,
  },
  L: {
    color: 'black',
    fontSize: 70,
    fontWeight: '600',
  },
  list:{
padding:10,
  },
  abt: {
    top: 52,
    left: 5,
    color: '#119988',
  },
  learn: {
    top: -20,
    height: 100,
    width: 110,
    flexDirection: 'row',
    left: 170,
  },
  body: {
    
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyy: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img5: {
    top: 20,
    right: 7,
  },
  img4: {
    right: 40,
    top: 10,
    height: 30,
    width: 30,
  },
  input: {
    height: 50,
    width: '100%',
    top: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingLeft: 20,
    fontFamily: 'bold'
  },
  homescreen: {
    flexDirection: 'column',
  },
  search: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
hader:{
  top:10,

},
  header: {
    padding:10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:'space-between',
    backgroundColor:"#119988"
  },
  profile: {
    height: 56,
    width: 56,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    left:"40%",
  },
  text: {
    color: '#2f2f2f',
  },
  img3: {
  
    height: 30,
    width: 30,
    padding: 10,
    top: -5,
  },
  listbox: {
    height: 80,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 10,
    paddingLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {height: 1, width: 0},
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
    elevation: 1,
  },
  txt: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 30,
    left: 20,
  },
  search: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    top: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingLeft: 20,
  },
  seicon: {
    top: 12,
    right: 40,
    height: 30,
    width: 30,
  },
   cir: {
    height: 40,
    width: 40,
    backgroundColor: '#119988',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sv: {
    height: '73.2%',
    ...Platform.select({
      android: {height: '73.52%'},
    }),
  },
  tcontent: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  patientcontent: {
    paddingLeft: 20,
  },
});
