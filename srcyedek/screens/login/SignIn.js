import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { View, Text, StyleSheet, Dimensions,KeyboardAvoidingView,StatusBar,Image, Alert} from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'

import firestore from '@react-native-firebase/firestore';
import { useState } from 'react/cjs/react.development'
import gStyles from '../../styles/gStyles';

export default function SignIn({navigation,route}) {

    const [name, setName]=useState()
    const [authCodeInput, setAuthCodeInput]=useState()
    const {phone}=route.params;
    const {authCode}=route.params;
    const [ok,setOk]=useState(false)

    const authCodeControl = () =>{
        if(String(authCode)===authCodeInput){
            setOk(true)
        }else{
            Alert.alert('Hata','Onay kodunu yanlış girdiniz, lütfen kontrol ediniz.')
        }
    }

    const Login=()=>{
        if(1===1) {
            try {
                firestore()
                .collection('userList')
                .doc(phone)
                .set({
                    phoneNumber:phone,
                    name:name,
                    sendDate: firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                  AsyncStorage.setItem('phoneNumber',phone)
                  console.log('kayit basarili');
                  Alert.alert('Basarili', 'Anasayfaya Yonlendiriliyorsunuz')
                  setTimeout(() => {
                    navigation.push('Home', {phone:phone})
                  }, 1000);
                });
            } catch (error) {                
                Alert.alert('Hata', 'Bilinmeyen Bir Hata Olustu')
            }
        }
        else{
            Alert.alert('Bir hata oluştu', 'Lütfen girdiğiniz bilgileri kontrol ediniz.')
        }
      }

    return (
        <ScrollView style={{flex:1, width:Dimensions.get('screen').width}} 
            showsVerticalScrollIndicator={false}
        >
{!ok
?
<KeyboardAvoidingView behavior={'height'} style={styles.container} >
            <StatusBar backgroundColor={'#118ab2'}/>
            <View style={styles.header} >
                <Text style={styles.headerText} >{phone} numaralı cep telefonunuza bir onay kodu gönderdik. Lütfen 5 haneli onay kodunu giriniz. </Text>
            </View>

             <TextInput
                value={authCodeInput}
                onChangeText={(text)=>setAuthCodeInput(text)}
                style={styles.textInput}
                placeholder={'Onay Kodunu giriniz.'}
                keyboardType={'default'}

            />
            <TouchableOpacity style={styles.button}  onPress={()=>authCodeControl()}>
                <Text style={styles.buttonText} >
                Devam Et
                </Text>
            </TouchableOpacity>
            
            <Text style={styles.headerTextDes}>Onay Kodu : {authCode}</Text>
        </KeyboardAvoidingView>
:
<KeyboardAvoidingView behavior={'height'} style={styles.container} >
            <StatusBar backgroundColor={'#118ab2'}/>
            <View style={styles.header} >
                <Text style={styles.headerText} >Tebrikler, telefon numaranız onaylanmıştır. Lütfen adınızı giriniz. </Text>
            </View>

             <TextInput
                value={name}
                onChangeText={(text)=>setName(text)}
                style={styles.textInput}
                placeholder={'Adınızı giriniz.'}
                keyboardType={'default'}

            />
            <TouchableOpacity style={styles.button}  onPress={()=>Login()}>
                <Text style={styles.buttonText} >
                Başlat
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
}
        
        </ScrollView> 

    )
}

const styles = StyleSheet.create({
    container:{
        width:Dimensions.get('screen').width,
        height:Dimensions.get('screen').height-150,
        justifyContent:'flex-start',
        alignItems:'center'
    },

    header:{
        paddingBottom:10,
        width:Dimensions.get('screen').width,
        justifyContent:'center',
        alignItems:'center'
    },
    headerText:{
        fontSize:14,
        fontWeight:'normal',
        width:Dimensions.get('screen').width,
        textAlign:'left',
        paddingVertical:10,
        paddingHorizontal:10,
        lineHeight:20,
        height:80
    },
    headerTextDes:{
        fontSize:22,
        fontWeight:'normal',
        width:Dimensions.get('screen').width,
        textAlign:'center',
        paddingVertical:15,

    },
    textInput:{
        width:Dimensions.get('screen').width-10,
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
        width:Dimensions.get('screen').width*0.9,
        backgroundColor:'#118ab2',
        justifyContent:'center',
        alignItems:'center',
        marginTop:25,
        paddingHorizontal:10,
        paddingVertical:10,
        borderRadius:6
    },
    buttonText:{
        width:Dimensions.get('screen').width*0.9,
        alignItems:'center',
        textAlign:'center',
        color:'#fff'

    }
})