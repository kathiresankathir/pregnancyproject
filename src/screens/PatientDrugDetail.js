// import {
//   StyleSheet,
//   Text,
//   View,
//   StatusBar,
//   SafeAreaView,
//   TouchableOpacity,
//   Alert,

// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import PropTypes from 'prop-types';
// import {printToFileAsync} from 'expo-print';
// import {shareAsync} from 'expo-sharing';
// import FileSystem from 'expo-file-system';
// import ExportIcon from 'react-native-vector-icons/Ionicons';


// const PatientDrugDetail = ({route}) => {
//   const {patient} = route.params;
//   const {drug} = route.params;
//   const [calculatedValue, setCalculatedValue] = useState(null);
//   const [calculationType, setCalculationType] = useState('normal');
//   const [fluidEstimation, setFluidEstimation] = useState(null);
//   const [activeButton, setActiveButton] = useState(null);
//   //doc share
//   const handlePrint = async () => {
//     const currentDate = new Date();
//     const formattedDate = currentDate.toLocaleDateString();
//     const formattedTime = currentDate.toLocaleTimeString();
//     Alert.alert(`Download ${patient.name} report`, 'Are you sure?', [
//       {
//         text: 'Cancel',
//         style: 'destructive',
//       },
//       {
//         text: 'Download',
//         style: 'default',
//         onPress: async () => {
//           // Print logic
//           const pdfTitle = `${patient.name.replace(
//             /\s+/g,
//             ' ',
//           )}Drug Details-Report.pdf`;

//           const html = `
//           <html>
//             <head>
//               <style>
//                 body {
//                   font-family: 'Arial, sans-serif';
//                   color: #333;                 
//                 }
//                 h1 {
//                   color: #ff7373;
//                 }
//                 h2 {
//                   color: #333;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
//                 }
//                 p {
//                   margin-bottom: 10px;
//                 }
//                 .patient-details {
//                   font-weight: bold;
//                 }
//                 .drug-details {
//                   margin-top: 20px;
//                 } 
//                 .fatal-dosage {
//                   font-weight: bold;
//                   color: red;
//                 }
//               </style>
//               <title>${pdfTitle}</title>
//             </head>
//             <body>
//               <h1>Patient Drug Details Report</h1>
//               <p>Exported on: ${formattedDate} at ${formattedTime}</p>
//               <div class="patient-details">
//                 <p>Patient Name: ${patient.name}</p>
//                 <p>Age: ${patient.age}</p>
//                 <p>Gender: ${patient.gender}</p>
//                 <p>Haemoglobin: ${patient.haemoglobin}</p>
//                 <p>Weight: ${patient.weight} kg</p>
//                 <p>Height: ${patient.height}</p>
//               </div>
//               <h2 class="drug-details">Drug Details</h2>
//               <div class="drug-details">
//                 <p>Drug Name: ${drug.drugname}</p>
//                 <p>Min drug-dosage : ${drug.dosage.min.value} = ${
//             calculatedValue && calculatedValue.min
//           } ${drug.dosage.min.unit}</p>
//                 <p>Max drug-dosage : ${drug.dosage.max.value} = ${
//             calculatedValue && calculatedValue.max
//           } ${drug.dosage.max.unit}</p>
//               </div>
    
//               <div class="fatal-dosage">
//                 <p>Fatal Dosage : ${drug.fataldosage.value} ${
//             drug.fataldosage.unit
//           }</p>
//               </div>
//             </body>
//           </html>
//         `;

//           try {
//             console.log('HTML Content:', html);
//             const pdf = await printToFileAsync({
//               html: html,
//               base64: false,
//             });

//             console.log('Print to File Response:', pdf);
//             // Extract patient name from the route params
//             const patientName = patient.name.replace(/\s+/g, ' ');
//             const filename = `${patientName}_Drug_Details_Report.pdf`;
//             const newUri = `${FileSystem.documentDirectory}${filename}`;
//             await FileSystem.moveAsync({
//               from: pdf.uri,
//               to: newUri,
//             });
//             await shareAsync(newUri);
//             const pdfUri = pdf.uri;

//             console.log(`PDF saved at ${pdfUri}`);
//           } catch (error) {
//             console.error('Error generating PDF', error);
//           }
//         },
//       },
//       {cancelable: false},
//     ]);
//   };
   

//   //handle notification 
//   // const showNotification = async () => {
//   //   try {
//   //     const notification = await Notifee.displayNotification({
//   //       title: 'Export Report',
//   //       body: 'Report has been exported successfully!',
//   //       android: {
//   //         channelId: 'export-channel-id', // Make sure to create a channel
//   //       },
//   //       ios:{
//   //         sound: 'default', // Specify the notification sound
//   //       badge: true, // Show the badge number on the app icon
//   //       }
//   //     });
//   //     console.log('Notification displayed:', notification);
//   //   } catch (error) {
//   //     console.error('Error displaying notification:', error);
//   //   }
//   // };




//   const handleCalculate = () => {
//     const resultMin = calculate(drug.dosage.min.value);
//     const resultMax = calculate(drug.dosage.max.value);

//     const formattedResultMin = resultMin.toFixed(2);
//     const formattedResultMax = resultMax.toFixed(2);

//     setCalculatedValue({min: formattedResultMin, max: formattedResultMax});
//     setCalculationType('normal');
//     setActiveButton('normal');
//   };
//   useEffect(() => {
//     handleCalculate(); // Set initial calculated value when the component mounts
//   }, []); // Empty dependency array ensures the effect runs only once

//   PatientDrugDetail.propTypes = {
//     route: PropTypes.object.isRequired,
//   };

//   const calculate = dosage => {
//     const calcWeight = patient.weight;
//     return calcWeight * dosage;
//   };

//   const renderCalculationBox = () => {
//     if (calculationType === 'normal') {
//       return (
//         <>
//           {drug.dosage.min.value > 0 && (
//             <View style={styles.calcpart}>
//               <View>
//                 <Text
//                   style={{
//                     position: 'absolute',
//                     bottom: 60,
//                     fontWeight: 'bold',
//                   }}>
//                   For {drug.dosage.min.value} :
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}>
//                 <Text>Weight</Text>
//                 <Text style={{paddingTop: 20}}>{patient.weight}</Text>
//               </View>
//               <Text style={{left: 30, top: 35, fontSize: 18}}>*</Text>
//               <View
//                 style={{
//                   left: 60,
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}>
//                 <Text>MinDosage</Text>
//                 <Text style={{paddingTop: 20}}>{drug.dosage.min.value}</Text>
//               </View>
//               <Text style={{left: 100, top: 15}}>=</Text>
//               <Text style={{left: 130, top: 10, fontWeight: 'bold'}}>
//                 {calculatedValue && calculatedValue.min} {drug.dosage.min.unit}
//               </Text>
//             </View>
//           )}
//           {/* for max value */}
//           {drug.dosage.max.value > 0 && (
//             <View style={styles.calcpart}>
//               <View>
//                 <Text
//                   style={{
//                     position: 'absolute',
//                     bottom: 60,
//                     fontWeight: 'bold',
//                   }}>
//                   For {drug.dosage.max.value} :
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}>
//                 <Text>Weight</Text>
//                 <Text style={{paddingTop: 20}}>{patient.weight}</Text>
//               </View>
//               <Text style={{left: 30, top: 35, fontSize: 18}}>*</Text>
//               <View
//                 style={{
//                   left: 60,
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}>
//                 <Text>MaxDosage</Text>
//                 <Text style={{paddingTop: 20}}>{drug.dosage.max.value}</Text>
//               </View>
//               <Text style={{left: 100, top: 15}}>=</Text>
//               <Text style={{left: 130, top: 10, fontWeight: 'bold'}}>
//                 {calculatedValue && calculatedValue.max} {drug.dosage.max.unit}
//               </Text>
//             </View>
//           )}
//           <Text style={{fontWeight: 'bold', paddingBottom: 10, paddingTop: 5}}>
//             Fatal Dosage :{' '}
//             <Text style={{color: 'red'}}>
//               {drug.fataldosage.value} {drug.fataldosage.unit}
//             </Text>
//           </Text>
//         </>
//       );
//     } else if (calculationType === 'fluid') {
//       const weight = patient.weight;
//       const fluidEstimation =
//         4 * Math.min(10, weight) +
//         2 * Math.min(10, Math.max(0, weight - 10)) +
//         1 * Math.max(0, weight - 20);
//       const hours = fluidEstimation * 6;
//       const halfhour = hours / 2;
//       const secondhalfhour = hours / 2 / 2;
//       const thirdspaceloss = 3 * weight;
//       const firsthour = halfhour + fluidEstimation + thirdspaceloss;

//       const secondhour = secondhalfhour + fluidEstimation + thirdspaceloss;
//       return (
//         <>
//           <View style={styles.calcpart}>
//             <Text>Fluid Calculation = </Text>
//             <Text>
//               <Text> 4 : 2 : 1 = </Text>{' '}
//               <Text style={styles.color}>{fluidEstimation}</Text> * 6
//               (fastinghours)
//             </Text>
//           </View>
//           <View style={styles.calcbox}>
//             <Text style={styles.textcontainer}>
//               1st hour = {halfhour.toFixed(1)} + {fluidEstimation} +{' '}
//               {thirdspaceloss} ={' '}
//               <Text style={styles.color}>{firsthour.toFixed(1)}</Text>
//             </Text>
//             <Text style={styles.textcontainer}>
//               2nd hour = {secondhalfhour.toFixed(1)} + {fluidEstimation} +{' '}
//               {thirdspaceloss} ={' '}
//               <Text style={styles.color}>{secondhour.toFixed(1)}</Text>
//             </Text>
//             <Text style={styles.textcontainer}>
//               3rd hour ={' '}
//               <Text style={styles.color}> {secondhour.toFixed(1)}</Text>
//             </Text>
//           </View>
//         </>
//       );
//     } else if (calculationType === 'bloodLoss') {
//       const startinghaemoglobin = patient.haemoglobin;
//       let percentagereduction;
//       if (patient.haemoglobin <= 10) {
//         percentagereduction = 0.1;
//       } else {
//         percentagereduction = 0.2;
//       }

//       const targethaemoglobin = startinghaemoglobin * (1 - percentagereduction);

//       let EBV;
//       if (patient.gender === 'male') {
//         EBV = patient.weight * 75;
//       } else if (patient.gender === 'female') {
//         EBV = patient.weight * 65;
//       }

//       const th = targethaemoglobin.toFixed(2);
//       const bloodlosscalculation =
//         (EBV * (startinghaemoglobin - th)) / startinghaemoglobin;
//       const resultinml = bloodlosscalculation.toFixed(0);

//       return (
//         <>
//           <View style={styles.calcpart}>
//             <Text>Blood Loss Calculation:</Text>
//             {/* Your Blood Loss Calculation */}
//           </View>
//           <View
//             style={{paddingTop: 50, paddingBottom: 50, flexDirection: 'row'}}>
//             <Text style={{fontWeight: 'bold'}}> BloodLoss </Text>
//             <Text> = {EBV} * </Text>
//             <Text>
//               ({startinghaemoglobin}-{th}) /{' '}
//             </Text>
//             <Text>{startinghaemoglobin} =</Text>
//             <Text style={{fontWeight: 'bold', color: 'red'}}>
//               {' '}
//               {resultinml} ml{' '}
//             </Text>
//           </View>
//         </>
//       );
//     }

//     // Add more conditions for other calculation types if needed
//   };
//   const handleFluidCalculation = () => {
//     const FluidEstimation = renderCalculationBox();
//     setFluidEstimation(FluidEstimation);
//     setCalculationType('fluid');
//     setActiveButton('fluid');
//   };

//   const handleBloodLossCalculation = () => {
//     setCalculationType('bloodLoss');
//     setActiveButton('bloodLoss');
//   };
 
//   return (
//     <SafeAreaView>
//       <StatusBar />
//       <View style={styles.outerbox}>
//         <View style={styles.bodybox}>
//           <View style={styles.headercontent}>
//             <View style={{flexDirection: 'row'}}>
//               <Text style={styles.headname}>Patient Drug Details</Text>
//               <TouchableOpacity>
//                 <ExportIcon
//                   style={{left: 110}}
//                   name="md-download"
//                   size={25}
//                  onPress={handlePrint}
//                 />
//                 <Text  style={{left: 80, fontSize:12}}>(Export report)</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.whitebox}>
//               <View style={styles.listbox}>
//                 <View style={styles.listitem}>
//                   <View style={styles.cir}>
//                     <Text
//                       style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
//                       {patient.name[0].toUpperCase()}
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.patientcontent}>
//                   <Text style={styles.tcontent}>
//                     {patient.name.toUpperCase()}
//                   </Text>
//                   <Text>{patient.treatmentType}</Text>
//                 </View>
//               </View>
//               <View style={styles.bodycontent}>
//                 <Text>Age: {patient.age}</Text>
//                 <View style={styles.lineStyle} />
//                 <Text>{patient.gender}</Text>
//                 <View style={styles.lineStyle} />
//                 <View>
//                   <Text style={{paddingBottom: 10}}>
//                     Haemoglobin : {patient.haemoglobin}
//                   </Text>
//                   <Text style={styles.last}>Weight : {patient.weight} kg</Text>
//                   <Text>Height : {patient.height}</Text>
//                 </View>
//               </View>
//             </View>
//             <View style={styles.lineSt} />
//             <View style={styles.properalign}>
//               <View style={styles.search}>
//                 <View style={styles.searchstyle}>
//                   <View style={styles.input}>
//                     <Text style={{color: '#2f2f2f'}}>
//                       Drug name :{' '}
//                       <Text style={{color: '#ff7373', fontWeight: 'bold'}}>
//                         {drug.drugname}
//                       </Text>
//                     </Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity onPress={handleCalculate}>
//                   <View style={styles.btnstyle}>
//                     <Text style={styles.btn}>Calculate</Text>
//                     {activeButton === 'normal' && (
//                       <View style={styles.activeDot} />
//                     )}
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={styles.body}>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   paddingTop: 15,
//                   width: '100%',
//                   justifyContent: 'space-evenly',
//                 }}>
//                 <TouchableOpacity
//                   style={styles.btnstyle1}
//                   onPress={handleFluidCalculation}>
//                   <View>
//                     <Text style={[styles.btn]}>Fluid</Text>
//                     {activeButton === 'fluid' && (
//                       <View style={styles.activeDot2} />
//                     )}
//                   </View>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.btnstyle1}
//                   onPress={handleBloodLossCalculation}>
//                   <View>
//                     <Text style={styles.btn}>Blood Loss</Text>
//                   </View>
//                   {activeButton === 'bloodLoss' && (
//                     <View style={styles.activeDot3} />
//                   )}
//                 </TouchableOpacity>
               
//               </View>
//               <View style={styles.togglebox}>
//                 <View style={styles.bodyhead}>
//                   <Text style={{fontSize: 18, fontWeight: 'bold'}}>
//                     Calculation :
//                   </Text>
//                 </View>
//                 {renderCalculationBox()}
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PatientDrugDetail;

// const styles = StyleSheet.create({
//   alertContainer: {
//     backgroundColor: 'white',
//   },
//   activeDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//     position: 'absolute',
//     top: 10,
//     left: 80,
//   },
//   activeDot2: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//     position: 'absolute',
//     top: 3,
//     right:70,
//   },
//   activeDot3: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//     position: 'absolute',
//     top: 10,
//     right:140
//   },

//   textcontainer: {
//     marginVertical: 10,
//   },
//   color: {
//     color: 'red',
//     fontWeight: '700',
//   },
//   calcpart: {
//     flexDirection: 'row',
//     paddingTop: 40,
//     paddingBottom: 20,
//   },
//   listitems: {
//     justifyContent: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   listitem: {
//     justifyContent: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   btn: {
//     color: '#fff',
//   },
//   druglist: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingTop: 25,
//     paddingLeft: 10,
//     paddingRight: 30,
//   },
//   head: {
//     paddingLeft: 10,
//     paddingRight: 10,
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   bodyhead: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingTop: 20,
//   },

//   searchstyle: {
//     flexDirection: 'row',
//     height: 30,
//     borderWidth: 0.5,
//     borderColor: '#d9d9d9',
//     borderRadius: 5,
//     width: '68%',
//     paddingLeft: 10,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   btnstyle: {
//     width: '100%',
//     padding: 7,
//     paddingLeft: 20,
//     paddingRight: 20,
//     borderRadius: 30,
//     backgroundColor: '#ff7373',
//   },
//   btnstyle1: {
//     width: '50%',
//     padding: 8,
//     marginRight:10,
//     marginLeft:10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingLeft: 20,
//     paddingRight: 20,
//     borderRadius: 30,
//     backgroundColor: '#ff7373',
//   },
//   search: {
//     paddingTop: 30,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   lineSt: {
//     borderWidth: 0.5,
//     borderColor: 'black',
//     width: '100%',
//     top: 10,
//   },
//   last: {
//     paddingBottom: 10,
//   },
//   lineStyle: {
//     borderWidth: 0.5,
//     borderColor: 'black',
//     height: 40,
//   },
//   bodycontent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     top: 20,
//     paddingBottom: 30,
//     alignItems: 'center',
//   },
//   patientcontent: {
//     paddingLeft: 20,
//   },
//   drugcontent: {
//     paddingLeft: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//   },
//   tcontent: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     paddingBottom: 5,
//   },
//   tcontents: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     left: 15,
//   },
//   outerbox: {
//     paddingLeft: 10,
//     paddingRight: 10,
//   },
//   bodybox: {
//     width: '100%',
//     padding: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     borderRadius: 20,
//     top: 20,
//     height: 'auto',
//   },
//   headname: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2f2f2f',
//   },
//   cir: {
//     height: 40,
//     width: 40,
//     backgroundColor: '#ff7373',
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listbox: {
//     flexDirection: 'row',
//     paddingTop: 20,
//   },
//   listboxs: {
//     flexDirection: 'row',
//     paddingTop: 20,
//     justifyContent: 'space-between',
//   },
//   dosagestyle: {
//     right: 20,
//     top: 10,
//   },
// });
