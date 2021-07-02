import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native'
import React,{useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ContactList() {

  const [userInfo,setUserInfo]=useState()
  const [trigger,setTrigger]=useState(true)
 
  useEffect (()=>{
      AsyncStorage.getItem('phoneNumber').then(value =>{
          if(value!==null){
              getUserInfo(value)
              console.log("astnc:" , value)

          }else{               
              setTrigger(false)
              console.log("astnc:" , value)

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
          setUserInfo(documentSnapshot.data())
        }else{
          setUserInfo(documentSnapshot.data())
          //setAuth();
        }
      });
alert(JSON.stringify(userInfo))
  } catch (error) {
      alert(error)
      setTrigger(false)
  }


}



const[data2,setData2]=useState()
  useEffect(() => {
    firestore()
    .collection('userList')
    .onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((documentSnapshot) => {
        users.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setData2(users);
      console.log(users)
    });
  }, []);



   
    const [data, setData]= useState([]);
    const [createMessage, setCreateMessage]=useState();
    const navigation = useNavigation();
   
    const getUser = (phoneNumber) =>{
      Alert.alert(phoneNumber)
        if(phoneNumber?.length===11){
            try {
            firestore()
            .collection('userList')
            .doc(phoneNumber)
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
        .doc(userInfo.phoneNumber)
        .collection('messageUsername')
        .doc(item.phoneNumber)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);
      
          if (documentSnapshot.exists) {
            navigation.push('Chat', {phone:userInfo.phoneNumber, item:item})
          }else{
            firestore()
            .collection('messageList')
            .doc(userInfo.phoneNumber)
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
            .doc(userInfo.phoneNumber)
            .set({
                phoneNumber:userInfo.phoneNumber,
                name:userInfo.name,
                date: firestore.FieldValue.serverTimestamp(),
                lastMessage:""
            })
            .then(() => {
              console.log('oldu basarili');
              navigation.push('Chat', {phone:userInfo.phoneNumber, item:item})
            });
          }
        });
    }




  return (
    <View>
    <FlatList
            data={data2}
            inverted={false}
            style={styles.flatlistCom}
            horizontal={false}
            style={{flex:1}}
            renderItem={({item})=>(
            
            <TouchableOpacity style={styles.container} onPress={()=>getUser(item.phoneNumber)}>
              <View>
                <Icon name="person-circle-outline" size={40} color={'#555'} />
              </View>
              <View>
                <Text style={styles.text} > {item.name} </Text>
                <Text style={styles.text2} > {item.status} </Text>
              </View>
             </TouchableOpacity>
               
            )}
    />

    </View>
  )
}

const styles = StyleSheet.create({
  

    flatlistCom:{
      flexDirection:'row',
      width:Dimensions.get('screen').width-10,
      paddingHorizontal:5,
    },

    container:{
      width:Dimensions.get('screen').width,
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
      borderWidth:0.5,
      borderColor:'#eee',
      paddingHorizontal:10,
      paddingVertical:10,
    },
    text:{
      width:Dimensions.get('screen').width-50
    },
    text2:{
      width:Dimensions.get('screen').width-50,
      fontSize:10,
      color:'#888'
    }

});