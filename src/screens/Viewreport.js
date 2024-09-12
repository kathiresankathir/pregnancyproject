import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { API_SERVER_URL, API_SERVER_SOCKET } from './config';

const socket = socketIOClient(`${API_SERVER_SOCKET}`);

const Viewreport = ({ route }) => {
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  
  // Get patientID from route params
  const patientID = route?.params?.patient?.patientid;

  // Function to fetch reports from all endpoints
  const fetchReports = async () => {
    if (!patientID) {
      setError('Patient ID is missing');
      setLoading(false);
      return;
    }

    setRefreshing(true);
    setLoading(true);
    try {
      // Fetch data from the anemia, hypertension, and general report endpoints
      const [anemiaResponse, hyperResponse, generalResponse] = await Promise.all([
        axios.get(`${API_SERVER_URL}/fetch-anemia-data/${patientID}`),
        axios.get(`${API_SERVER_URL}/fetch-hyper-data/${patientID}`),
        axios.get(`${API_SERVER_URL}/fetch-General-data/${patientID}`)
      ]);

      // Combine all reports
      const combinedReports = [
        ...anemiaResponse.data,
        ...hyperResponse.data,
        ...generalResponse.data
      ];

      setReports(combinedReports);
      setError(null);
    } catch (error) {
      setError('Error fetching reports');
      console.log('Error fetching reports:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(); // Fetch reports when component mounts
  }, [patientID]);

  // Function to handle pressing a report item
  const handleReportPress = item => {
    navigation.navigate('Reportfile', { reportItem: item });
  };

  // Render each report item
  const renderReportItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleReportPress(item)}>
      <View style={styles.reportItem}>
        <Text style={styles.reportTitle}>Report - {index + 1}</Text>
        <Text style={styles.info}>Dated on: {new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
    });
    return () => {
      navigation.setOptions({
        tabBarVisible: true,
      });
    };
  }, [navigation]);

  useEffect(() => {
    const updateRecentlyViewed = async () => {
      try {
        const recentlyViewedData = await AsyncStorage.getItem('recentlyViewed');
        let recentlyViewedPatients = recentlyViewedData ? JSON.parse(recentlyViewedData) : [];

        const existingPatientIndex = recentlyViewedPatients.findIndex(
          p => p._id === route.params.patient._id,
        );

        if (existingPatientIndex !== -1) {
          recentlyViewedPatients[existingPatientIndex].timestamp = new Date().toISOString();
        } else {
          recentlyViewedPatients = [
            { ...route.params.patient, timestamp: new Date().toISOString() },
            ...recentlyViewedPatients.slice(0, 4),
          ];
        }

        await AsyncStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewedPatients));
      } catch (error) {
        console.error('Error updating recently viewed patients:', error);
      }
    };

    if (route.params?.patient) {
      updateRecentlyViewed();
    }
  }, [route.params?.patient]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.outerbox}>
        <View style={styles.bodybox}>
          <View style={styles.headercontent}>
            <Text style={styles.headname}>Reports</Text>
            <Text>{}</Text>
            <View style={styles.lineSt} />
            <View style={styles.bodyhead}>
            </View>
            <View style={styles.container0}>
              {loading ? (
                <ActivityIndicator size="large" color="#119988" />
              ) : error ? (
                <Text>{error}</Text>
              ) : (
                <FlatList
                  data={reports}
                  renderItem={renderReportItem}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={<Text>No reports available</Text>}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={fetchReports}
                      colors={['#119988']}
                    />
                  }
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Viewreport;

const styles = StyleSheet.create({
  info: {
    color: "#fff"
  },
  reportTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#fff"
  },
  body: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 20,
    alignItems: 'center'
  },
  container0: {
    flex: 0,
    paddingTop: 20,
    maxHeight: "65%"
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#199999",
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
  outerbox: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  bodybox: {
    width: '100%',
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    top: 10,
    height: '100%',
  },
  headname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f2f2f',
  },
  lineSt: {
    borderWidth: 0.6,
    borderColor: 'black',
    width: '100%',
    top: 10,
  },
});
