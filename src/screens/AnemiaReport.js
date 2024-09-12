import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Button, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as Permissions from 'expo-permissions';

const AnemiaReport = ({ route, navigation }) => {
  const { reportItem } = route.params; // Get the report details from the navigation params

  const requestPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'You need to grant media library permissions to save the PDF.');
      return false;
    }
    return true;
  };

  // Function to generate PDF
  const createPDF = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
  
    const htmlContent = `
      <h1>Anemia Report</h1>
      <h3>Report Date: ${new Date(reportItem.date).toLocaleDateString()}</h3>
      <h4>Hemoglobin and Blood Data:</h4>
      <p>Hemoglobin Level: ${reportItem.HemoglobinLevel} g/dL</p>
      <p>Blood Transfusion: ${reportItem.BloodTransfusion ? "Yes" : "No"}</p>
      <p>Bleeding Disorder: ${reportItem.BleedingDisorder ? "Yes" : "No"}</p>
      <h4>Red Blood Cell Indices:</h4>
      <p>Mean corpuscular volume (MCV): ${reportItem.MCV} fL</p>
      <p>Mean corpuscular hemoglobin (MCH): ${reportItem.MCH} pg/cell</p>
      <p>Mean corpuscular hemoglobin concentration (MCHC): ${reportItem.MCHC} g/dL</p>
      <p>Red Cell Distribution Width (RDW): ${reportItem.RDW} %</p>
      <p>Mentzer Index: ${reportItem.MentzerIndex}</p>
      <h4>Anemia Diagnosis:</h4>
      <p>Iron Deficiency Anemia: ${reportItem.IronDeficiencyAnemia ? "Yes" : "No"}</p>
      <p>Target HB: ${reportItem.targetHB} g/dL</p>
      <p>Actual HB: ${reportItem.actualHB} g/dL</p>
      <p>Prepregnancy Weight: ${reportItem.prepregnancyWeight} kg</p>
      <p>Iron Deficiency Anemia Value: ${reportItem.IronDeficiencyAnemiaValue} mg</p>
      <h4>Additional Details:</h4>
      <p>Other Reports: ${reportItem.otherReports}</p>
    `;
  
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
      Alert.alert('PDF Generated', 'Your report has been saved and ready for sharing.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Anemia Report</Text>
        </View>

        <View style={styles.reportContainer}>
          {/* Report Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Report Date:</Text>
            <Text style={styles.value}>{new Date(reportItem.date).toLocaleDateString()}</Text>
          </View>

          {/* Hemoglobin and Transfusion */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Hemoglobin and Blood Data:</Text>
            <Text style={styles.label}>Hemoglobin Level:</Text>
            <Text style={styles.value}>{reportItem.HemoglobinLevel} g/dL</Text>

            <Text style={styles.label}>Blood Transfusion:</Text>
            <Text style={styles.value}>{reportItem.BloodTransfusion ? "Yes" : "No"}</Text>

            <Text style={styles.label}>Bleeding Disorder:</Text>
            <Text style={styles.value}>{reportItem.BleedingDisorder ? "Yes" : "No"}</Text>
          </View>

          {/* Additional RBC Indices */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Red Blood Cell Indices:</Text>
            <Text style={styles.label}>Mean corpuscular volume (MCV):</Text>
            <Text style={styles.value}>{reportItem.MCV} fL</Text>

            <Text style={styles.label}>Mean corpuscular hemoglobin (MCH):</Text>
            <Text style={styles.value}>{reportItem.MCH} pg/cell</Text>

            <Text style={styles.label}>Mean corpuscular hemoglobin concentration (MCHC):</Text>
            <Text style={styles.value}>{reportItem.MCHC} g/dL</Text>

            <Text style={styles.label}>Red Cell Distribution Width (RDW):</Text>
            <Text style={styles.value}>{reportItem.RDW} %</Text>

            <Text style={styles.label}>Mentzer Index:</Text>
            <Text style={styles.value}>{reportItem.MentzerIndex}</Text>
          </View>

          {/* Anemia Diagnosis */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Anemia Diagnosis:</Text>
            <Text style={styles.label}>Iron Deficiency Anemia:</Text>
            <Text style={styles.value}>{reportItem.IronDeficiencyAnemia ? "Yes" : "No"}</Text>

            <Text style={styles.label}>Target HB:</Text>
            <Text style={styles.value}>{reportItem.targetHB} g/dL</Text>
            <Text style={styles.label}>Actual HB:</Text>
            <Text style={styles.value}>{reportItem.actualHB} g/dL</Text>
            <Text style={styles.label}>Prepregnancy Weight:</Text>
            <Text style={styles.value}>{reportItem.prepregnancyWeight} kg</Text>
            <Text style={styles.label}>IronDeficiency Anemia Value :</Text>

            <Text style={styles.value}>{reportItem.IronDeficiencyAnemiaValue} mg </Text>
          </View>

          {/* Prepregnancy and Other Details */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Additional Details:</Text>

            <Text style={styles.label}>Other Reports:</Text>
            <Text style={styles.value}>{reportItem.otherReports}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Button to download PDF */}
      <TouchableOpacity style={styles.downloadButton} onPress={createPDF}>
        <Text style={styles.downloadButtonText}>Download PDF</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AnemiaReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  reportContainer: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  section: {
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
