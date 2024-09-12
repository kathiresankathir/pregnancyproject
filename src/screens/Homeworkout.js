import { StyleSheet, Text, View ,Image,TouchableOpacity} from 'react-native'
import React from 'react'

const Homeworkout = ({navigation}) => {
  return (
    <View>
    <View style={{top:30}}>
    <Image source={require('../images/vdo.png')}/>
    </View>
    <View style={styles.box1}>
    <Text style={{fontWeight:'bold',fontSize:24}}>Best workouts for you</Text>
    <Text style={{fontSize:18,color:"#119999",padding:25}} >You will have everything you need to reach your personal fitness goals - for free!</Text>
    <View >
    <TouchableOpacity style={styles.box2}>
    <Text onPress={() => navigation.push('Vlcpage')}>Get Start</Text>
  </TouchableOpacity>   
   </View>
    </View>
    </View>
  )
}

export default Homeworkout

const styles = StyleSheet.create({
box1:{
    alignItems:'center',
    top:40,
},
box2:{
    backgroundColor: '#0EBE7F',
    alignItems: 'center',
    height:40,
    width:190,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 70,
      
}
})