import { View, Text, StyleSheet, Dimensions, Alert,SafeAreaView, Pressable, Image } from 'react-native'
import React,{useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactList({onClick}) {
  const [userInfo,setUserInfo]=useState()
  const [trigger,setTrigger]=useState(true)
  const [data, setData]= useState([]);
  const [createMessage, setCreateMessage]=useState();
  const navigation = useNavigation();
  const[data2,setData2]=useState()
 
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <Text style={{color:'#fff', fontFamily:'GoogleSans-Regular', fontSize:16}} >Yeni mesaj Oluştur</Text>,
      headerStyle: {
        shadowRadius: 0,
        shadowOffset: {height:0},
        elevation:0,
      },
      headerTintColor: "#4B5563",
      headerLeft: () => (
        <Pressable style={{ paddingHorizontal: 12 }} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={30} color={'#fff'} />
        </Pressable>
      ),
     
    })
  }, [navigation])

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
  } catch (error) {
      alert(error)
      setTrigger(false)
  }
}

  useEffect(() => {
    firestore()
    .collection('userList')
    .orderBy('name', 'asc')
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

    const getUser = (phoneNumber) =>{
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
            navigation.replace('Chat', {phone:userInfo.phoneNumber, item:item})
          }else{
            firestore()
            .collection('messageList')
            .doc(userInfo.phoneNumber)
            .collection('messageUsername')
            .doc(item.phoneNumber)
            .set({
                phoneNumber:item.phoneNumber,
                name:item.name,
                photoUrl:item.photoUrl,
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
                photoUrl:userInfo.photoUrl,
                date: firestore.FieldValue.serverTimestamp(),
                lastMessage:""
            })
            .then(() => {
              console.log('oldu basarili');
              navigation.replace('Chat', {phone:userInfo.phoneNumber, item:item})
            });
          }
        });
    }




  return (
    <SafeAreaView>
        <FlatList
            data={data2}
            inverted={false}
            style={styles.flatlistCom}
            horizontal={false}
            style={{height:Dimensions.get('screen').height-150}}
            renderItem={({item})=>(
              <TouchableOpacity style={styles.container} onPress={()=>getUser(item.phoneNumber)}>
                <View>
                  {item?.photoUrl
                  
                  ? <Image
                      style={styles.image}
                      source={{uri :item.photoUrl}}
                    />
                :<Icon name="person-circle-outline" size={50} color={'#555'}/>
                }
                </View>
                <View>
                  <Text style={styles.text} > {item.name} </Text>
                  <Text style={styles.text2} > {item.status} </Text>
                </View>
              </TouchableOpacity>
            )}
    />

    </SafeAreaView>
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
    },
    image:{
      width:50,
      height:50,
      borderRadius:25
    },

});