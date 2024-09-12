import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground  } from 'react-native'
import React from 'react'

const Welcome = ({navigation}) => {
  return (
    <View style={styles.frame}>
        
      <View style = {styles.logos}>
         
         <Image
        
        source={require('../images/image1.png')}
      />
      <Text style={styles.fullform}>Consult Specialist Doctors Securely And Privately </Text>
      
      <TouchableOpacity onPress={()=>navigation.navigate('Toggle')} style={styles.loginbtn}>
          <Text  style  ={styles.start}>Get Started</Text>
      </TouchableOpacity>
 
      </View> 
    
    </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
  frame:{
    flex:1,
    alignItems:'center'
  },
  logos:{
    flex:1,
    alignItems:'center',
    position:'relative',
    flexDirection:'column',
    top:170
  },
  
  
  fullform:{
    fontSize:24,
    top:100,
    color:'#2f2f2f',
    fontWeight:'bold',
    textAlign:"center"
  },
  
  loginbtn:{
    width:'100%',
    paddingLeft:'30%',
    paddingRight:'30%',
    height:50,
    borderRadius:50,
    backgroundColor:'#119988',
    marginTop:150,
    alignItems:'center',
    justifyContent:'center'
    
  },
  start:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:15,
    
  }
})