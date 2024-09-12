import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Reportfile = ({ route }) => {
  // Destructure route.params and provide default value for reportItem
  const { reportItem = {} } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Anemia Reportfile</Text>
      {reportItem && (
        <View>
          <Text>Hemoglobin Level: {reportItem.HemoglobinLevel}</Text>
          <Text>Blood Transfusion: {reportItem.BloodTransfusion}</Text>
          <Text>Bleeding Disorder: {reportItem.BleedingDisorder}</Text>
          <Text>MCV: {reportItem.MCV}</Text>
          <Text>MCH: {reportItem.MCH}</Text>
          <Text>MCHC: {reportItem.MCHC}</Text>
          <Text>RDW: {reportItem.RDW}</Text>
          <Text>Mentzer Index: {reportItem.MentzerIndex}</Text>
          <Text>Iron Deficiency Anemia: {reportItem.IronDeficiencyAnemia}</Text>
          <Text>Target HB: {reportItem.targetHB}</Text>
          <Text>Actual HB: {reportItem.actualHB}</Text>
          <Text>Prepregnancy Weight: {reportItem.prepregnancyWeight}</Text>
          <Text>Other Reports: {reportItem.otherReports}</Text> 
        </View>
      )}
      <View>
      <Text style={styles.title}> Hypertension Reportfile</Text>
      {reportItem && (
        <View>
          <Text>Hemoglobin Level: {reportItem.Headache}</Text>
          <Text>Blood Transfusion: {reportItem.Blurringofvision}</Text>
          <Text>Bleeding Disorder: {reportItem.Epigastricpain}</Text>
          <Text>MCV: {reportItem.Urineoutput}</Text>
          <Text>MCH: {reportItem.Systolicspvalue}</Text>
          <Text>MCHC: {reportItem.DiastolicBP}</Text>
          <Text>RDW: {reportItem.Meditationtaken}</Text>
          <Text>Mentzer Index: {reportItem.HistoryofHypertension}</Text>
          <Text>Iron Deficiency Anemia: {reportItem.Hemoglobin}</Text>
          <Text>Target HB: {reportItem.Platelets}</Text>
          <Text>Actual HB: {reportItem.SGOT}</Text>
          <Text>Prepregnancy Weight: {reportItem.SGPT}</Text>
          <Text>Albumin : {reportItem.Albumin}</Text>
          <Text>Total protein: {reportItem.Totalprotein}</Text>
          <Text>Direct Bilirubin: {reportItem.DirectBilirubin}</Text>
          <Text>Total Bilirubin: {reportItem.TotalBilirubin}</Text>
          <Text>UREA: {reportItem.UREA}</Text>
          <Text>Urine Albumin: {reportItem.UrineAlbumin}</Text>
          <Text>Urine ketone: {reportItem.Urineketone}</Text>
          <Text>Urine Sugar: {reportItem.UrineSugar}</Text>
          <Text>Other Reports: {reportItem.inputText}</Text>
        </View>
      )}

      </View>

    </View>
  );
};

export default Reportfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
