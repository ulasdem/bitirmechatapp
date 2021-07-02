import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions,KeyboardAvoidingView,StatusBar,Image, Alert} from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

import { useState } from 'react/cjs/react.development'
import gStyles from '../../styles/gStyles';



export default function LoginScreen({navigation,route}) {

    const  [phoneNumber,setPhoneNumber]=useState("05432883519")
    const [authCode,setAuthCode]=useState(Math.floor(Math.random()*10000)+10000)
    
    const setAuth = () =>{
        firestore()
                .collection('authCode')
                .doc(phoneNumber)
                .set({
                    phoneNumber:phoneNumber,
                    code:authCode,
                    sendDate: firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                  console.log('onay kodu veritabanına kaydedildi.')
                  navigation.push('SignIn', {phone:phoneNumber,authCode:authCode})
                });
    }
      const UserControl = () =>{
        if(phoneNumber.length===11){

        firestore()
        .collection('userList')
        .doc(phoneNumber)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);
          if (documentSnapshot.exists) {
            isuserlogin()
            navigation.push('Home', {phone:phoneNumber,userInfo:documentSnapshot.data()})
          }else{
            setAuth();
          }
        });

      }else{ Alert.alert('Lütfen Geçerli Bir Numara Giriniz')}
    }

    const isuserlogin = () =>{
        AsyncStorage.getItem('phoneNumber').then(deger =>{
            if(deger!==null){
                AsyncStorage.removeItem("phoneNumber");
                AsyncStorage.setItem('phoneNumber', phoneNumber);
            }else {
                AsyncStorage.setItem('phoneNumber', phoneNumber);
            }
    })
    }

    return (
        <ScrollView style={{flex:1, width:Dimensions.get('screen').width}} 
        
            showsVerticalScrollIndicator={false}
        >
            <StatusBar backgroundColor={'#118ab2'} />
        <KeyboardAvoidingView behavior={'height'} style={styles.container} >
            <StatusBar backgroundColor={'#118ab2'}/>
            <View style={styles.header} >
                <Image source={{uri:'https://images-na.ssl-images-amazon.com/images/I/A1IA1ZulCoL.png'}} style={{width:90, height:90, marginBottom:15}}  />                
                <Text style={styles.headerText} >UUD-Chat</Text>
                <Text style={styles.headerTextDes} >Güvenli sohbet </Text>
            </View>

            <TextInput
                value={phoneNumber}
                onChangeText={(text)=>setPhoneNumber(text)}
                style={styles.textInput}
                keyboardType={'number-pad'}
                placeholder={' Telefon numaranızı giriniz.'}
            />
            <TouchableOpacity style={styles.button}  onPress={()=>UserControl()}>
                <Text style={styles.buttonText} >
                Başlat
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
        </ScrollView> 

    )
}

const styles = StyleSheet.create({
    container:{
        width:Dimensions.get('screen').width,
        height:Dimensions.get('screen').height-150,
        justifyContent:'center',
        alignItems:'center'
    },

    header:{
        paddingBottom:30,
        width:Dimensions.get('screen').width,
        justifyContent:'center',
        alignItems:'center'
    },
    headerText:{
        fontSize:32,
        fontWeight:'bold',
        width:Dimensions.get('screen').width,
        textAlign:'center'
    },
    headerTextDes:{
        fontSize:18,
        fontWeight:'normal',
        width:Dimensions.get('screen').width,
        textAlign:'center'
    },
    textInput:{
        width:Dimensions.get('screen').width-100,
        borderBottomWidth:0.3, 
        fontSize:12,
        fontWeight:"100",
        borderColor:'#bbb',
        marginHorizontal:10,
        marginVertical:5,
        borderRadius:6,
        ...gStyles.defFont,
        paddingHorizontal:15,
        paddingVertical:1,
        height:28

    },
    button:{
        width:Dimensions.get('screen').width*0.6,
        backgroundColor:'#118ab2',
        justifyContent:'center',
        alignItems:'center',
        marginTop:25,
        paddingHorizontal:10,
        paddingVertical:10,
        borderRadius:6
    },
    buttonText:{
        width:Dimensions.get('screen').width*0.6,
        alignItems:'center',
        textAlign:'center',
        color:'#fff'

    }
})