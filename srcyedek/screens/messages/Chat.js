import React,{useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Dimensions, Text, FlatList, StatusBar,Pressable, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import gStyles from '../../styles/gStyles';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import moment from 'moment'
import 'moment/locale/tr'  
moment.locale('tr')

const ChatScreen = ({navigation, route}) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <Text style={{color:'#fff', fontFamily:'GoogleSans-Regular', fontSize:16}} >{item.name}</Text>,
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


  const {item}=route.params;
  const {phone}=route.params;
  const [mesaj, setMesajlar] = useState([]);
  const [gonderilenMesaj, setGonderilenMesaj]=useState();


 useEffect(() => {
 try {
  firestore()
  .collection('mesajlar')
  .doc(phone)
  .collection(item.phoneNumber)
  .orderBy('gonderimtarih','asc')
  .onSnapshot((querySnapshot) => {
    const mesajlar = [];
    querySnapshot.forEach((documentSnapshot) => {
      mesajlar.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
      });
    });
    setMesajlar(mesajlar);
    console.log(JSON.stringify(mesajlar.gonderimtarih));
  });
 } catch (error) {
   console.log("chatscreen",item)
 }

}, []);

const MessageItemGonderen = ({message,date})=>{
  return(
    <View style={styles.gonderenContainer}>
      <View style={styles.gonderen}>
        <Text style={styles.gonderenStyle}> {message} </Text>
        <Text style={[styles.text, {fontSize:10,color:'#fff', textAlign:'right'}]}>{date && moment(date.toDate()).format('LT')}</Text>

      </View>
    </View>
  )
}


const MessageItemAlan = ({message, date})=>{
  return(
    <View style={styles.alanContainer}>
      <View style={styles.alan}>
        <Text style={styles.alanStyle}> {message} </Text>
        <Text style={[styles.text, {fontSize:10,color:'#333', textAlign:'right'}]}>{date && moment(date.toDate()).format('LT')}</Text>
      </View>
    </View>
  )
}


const MesajGonder=()=>{
  firestore()
  .collection('mesajlar')
  .doc(phone)
  .collection(item.phoneNumber)
  .doc()
  .set({
    gonderen: phone,
    alan:item.phoneNumber,
    gonderimtarih: firestore.FieldValue.serverTimestamp(),
    date: firestore.FieldValue.serverTimestamp(),
    mesaj:gonderilenMesaj,
  })
  .then(() => {
    setGonderilenMesaj("")
    console.log('mesaj gitti');
    MesajGonder2();
  });
}

const MesajGonder2=()=>{
  firestore()
  .collection('mesajlar')
  .doc(item.phoneNumber)
  .collection(phone)
  .doc()
  .set({
    gonderen: phone,
    alan: item.phoneNumber,
    gonderimtarih: firestore.FieldValue.serverTimestamp(),
    mesaj:gonderilenMesaj,
  })
  .then(() => {
    console.log('mesaj gitti');
    LastMessage(phone, item.phoneNumber)
    LastMessage(item.phoneNumber, phone)
  });
}

const LastMessage = (itemone,itemtwo)=>{
  firestore()
  .collection('messageList')
  .doc(itemone)
  .collection('messageUsername')
  .doc(itemtwo)
  .update({
    lastMessage:gonderilenMesaj,
    date:firestore.FieldValue.serverTimestamp(),
  })
  .then(() => {
    console.log('Ok updated!');
  });
}
useEffect(() => {
  scrollView.scrollToEnd({ animated: true });
}, [mesaj])



  return (
    <View style={{flex:1}}>
       <StatusBar backgroundColor={'#118ab2'} /> 
       <ScrollView  ref={(ref) => { scrollView = ref; }} >
        <FlatList
          data={mesaj}
          style={styles.flatlistCom}
          horizontal={false}
          contentContainerStyle={{ flex:1, justifyContent:'flex-end'}}
          renderItem={({item, index})=>(
            <View key={index} >{
              item.gonderen==phone
              ?<MessageItemAlan message = {item.mesaj} date={item.gonderimtarih}/>
              :<MessageItemGonderen message = {item.mesaj} date={item.gonderimtarih}/>
            }</View>
          )}
        />
    </ScrollView>
      <View style={{flexDirection:'row', alignItems:'center', width:Dimensions.get('screen').width}}>
              <View style={{width:'85%',}} >
                <TextInput
                style={{borderWidth:1, borderWidth:1, borderColor:'#ddd', borderRadius:5, margin:10}}
                textAlign={'left'}
                value={gonderilenMesaj}
                onChangeText={text =>setGonderilenMesaj(text) } 
                />
              </View >
              <TouchableOpacity style={{width:'100%'}} onPress={()=>MesajGonder()}>
                <Text style={{width:55}} >Gönder</Text>
              </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },

    flatlistCom:{
      flexDirection:'row',
      width:Dimensions.get('screen').width-10,
      paddingHorizontal:5,
      
    },

  gonderen:{
    maxWidth:Dimensions.get('screen').width*0.7,
    paddingVertical:5,
    borderRadius:12,
    paddingHorizontal:10,
    backgroundColor:'#118ab2'
  },
  gonderenContainer:{
    width:Dimensions.get('screen').width-20,
    paddingVertical:5,
    marginVertical:5,
    marginHorizontal:10
  },
  alan:{
    maxWidth:Dimensions.get('screen').width*0.7,
    paddingVertical:5,
    paddingHorizontal:10,
    borderRadius:12,
    backgroundColor:'#ddd'
  },
  alanContainer:{
    width:Dimensions.get('screen').width-20,
    paddingVertical:5,
    marginVertical:5,
    alignItems:'flex-end',
  },
  gonderenStyle:{
    width:Dimensions.get('screen').width*0.65,
    color:'#fff',
    paddingVertical:7,
    fontFamily:'GoogleSans-Regular',

  },
  alanStyle:{
    width:Dimensions.get('screen').width*0.65,
    fontFamily:'GoogleSans-Regular',
    textAlign:'right',
    color:'#222',
    paddingVertical:7,
  },

});