import React,{useState, useEffect} from 'react'
import { View,StatusBar, Text, TextInput, TouchableOpacity,StyleSheet, Alert, Dimensions } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import  {useNavigation} from '@react-navigation/native'

export default function Search({phone,userInfo}) {
    const [data, setData]= useState([]);
    const [createMessage, setCreateMessage]=useState();
    const navigation = useNavigation();
   
    const getUser = () =>{
        if(createMessage?.length===11){
            try {
            firestore()
            .collection('userList')
            .doc(createMessage)
            .get()
            .then(documentSnapshot => {
                console.log('User exists: ', documentSnapshot.exists);
                if(!documentSnapshot.exists){
                    Alert.alert("Hata!", "Bu numara sistemde kayıtlı değil")
                }else{
                    setData(documentSnapshot.data())
                    isMessageValue(documentSnapshot.data())
                }
            });  
            } catch (error) {
                Alert.alert("Hata!", "Bir sorun oluştu. Lütfen tekrar deneyiniz.")
            }
        
        }else{
            Alert.alert("Hata!", "11 haneli bir numara giriniz")
        }
      
    }

    const isMessageValue = (item) =>{
        firestore()
        .collection('messageList')
        .doc(phone)
        .collection('messageUsername')
        .doc(item.phoneNumber)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);
      
          if (documentSnapshot.exists) {
            navigation.push('Chat', {phone:phone, item:item})
          }else{
            firestore()
            .collection('messageList')
            .doc(phone)
            .collection('messageUsername')
            .doc(item.phoneNumber)
            .set({
                phoneNumber:item.phoneNumber,
                name:item.name,
                date: firestore.FieldValue.serverTimestamp(),
                lastMessage:""
            })
            .then(() => {
              console.log('oldu basarili');
            });



            firestore()
            .collection('messageList')
            .doc(item.phoneNumber)
            .collection('messageUsername')
            .doc(phone)
            .set({
                phoneNumber:phone,
                name:userInfo.name,
                date: firestore.FieldValue.serverTimestamp(),
                lastMessage:""
            })
            .then(() => {
              console.log('oldu basarili');
              navigation.push('Chat', {phone:phone, item:item})
            });
          }
        });
    }
    return (
        <View style={styles.container} >
           <StatusBar backgroundColor={'#118ab2'} />
      <TextInput
                value={createMessage}
                onChangeText={(text)=>setCreateMessage(text)}
                style={styles.textInput}
                keyboardType={'number-pad'}
                placeholder='Telefon numarası ile ara'
            />

      <TouchableOpacity style={styles.submitButton} onPress={()=>getUser()}>
              <Text style={{color:'#fff'}} >{'Araa'}
              </Text>
      </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center'    
    },
    textInput:{
        width:Dimensions.get('screen').width-110,
        borderWidth:1, 
        height:40,
        borderColor:'#ddd',
        paddingHorizontal:10,
        paddingVertical:5,
        marginLeft:25,
        marginVertical:10,
        borderRadius:8,
        borderBottomRightRadius:0,
        borderTopRightRadius:0,
        backgroundColor:'#f1f1f1'
    },
    submitButton:{
        backgroundColor:'#118ab2',
        width:60,
        height:40,
        borderBottomRightRadius:8,
        borderTopRightRadius:8,
        justifyContent:'center',
        alignItems:'center',
    }
})