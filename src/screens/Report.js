import { StyleSheet, Text, View,TextInput,Alert,TouchableOpacity,ScrollView, SafeAreaView, KeyboardAvoidingView, Platform} from 'react-native'
import React, {useState} from 'react'
import { Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();





const Report  =() =>  {
  


  

return (
  <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1, ...Platform.select({ android: { flex: 1 } }) }}>
        <View style={styles.container1}>
          <View style={styles.container2} >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
     <View>
      <View style={styles.container3}>
</View>
</View>


            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Report

const styles = StyleSheet.create({
 
  container3:{
    flexDirection:'row',
    alignItems:'center',
    columnGap:40,
    top:10,
    height:'95%',
    width:'100%',
    backgroundColor:"#d9d9d9",
    borderRadius:15,
},
container1:{
flex:1,

},

container2:
{
padding:10,
width:'100%',
height:'100%',
backgroundColor:"#fff",
 columnGap:30,
flexDirection: 'column',  
},
 scrollViewContent: {
    flexGrow: 1,
    // alignItems: 'center',
    paddingBottom: 20,
    ...Platform.select({
      android: {paddingTop: 10},
    }),
  },
  
}); 
