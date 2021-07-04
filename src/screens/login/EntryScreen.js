import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions,KeyboardAvoidingView,StatusBar,Image, Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export default function EntryScreen({navigation,route}) {
    const [userInfo,setUserInfo]=useState()
    const [trigger,setTrigger]=useState(true)
    useEffect (()=>{
        AsyncStorage.getItem('phoneNumber').then(value =>{
            if(value!==null){
                getUserInfo(value)
            }else{               
                navigation.replace('Login')
            }
        })
    },[trigger]);

const getUserInfo=(phoneNumber)=>{
    try {
        firestore()
        .collection('userList')
        .doc(phoneNumber)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);
          if (documentSnapshot.exists) {
            navigation.replace('Home', {phone:phoneNumber,userInfo:documentSnapshot.data()})
          }else{
            setAuth();
            alert('setAuth')
          }
        });
    } catch (error) {
        console.log(error)
        setTrigger(false)
    }
}

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#118ab2'} />
            <Image source={{uri:'https://i.ibb.co/cyzrt3n/applogo.png'}} style={{width:200, height:200, marginBottom:15,justifyContent:'center',alignItems:'center'}}  />                
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})