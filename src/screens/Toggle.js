import { StyleSheet, Text, View,TouchableOpacity ,Image} from 'react-native'
import {useNavigation} from '@react-navigation/native';
const Toggle = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container1}>
     <View>
      <Image source={require('../images/doctorimg.png')}/>
      <TouchableOpacity onPress={()=>navigation.navigate('Login')} style={{borderRadius:20, padding:5 , top:10,backgroundColor:"#119988", justifyContent:"center", alignItems:"center"}}>
      <Text style={styles.welt}>Doctor</Text>
      </TouchableOpacity>
     </View>
     <View style={styles.container2}>
     <View>
      <Image source={require('../images/patient.png')}/>
      <TouchableOpacity onPress={()=>navigation.navigate('PatientLogin')} style={{borderRadius:20, padding:5 , top:10,backgroundColor:"#119988", justifyContent:"center", alignItems:"center"}}>
      <Text style={styles.welt}>Patient</Text>
      </TouchableOpacity>
     </View>
     </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container1:{
    top:150,
    justifyContent:"center",
    alignItems:"center"
  },
  container2:{
    top:100,
    justifyContent:"center",
    alignItems:"center"
  },
  welt:{
    color:"#fff",
    fontWeight:'bold',
    fontSize:18,
  }

})

export default Toggle;