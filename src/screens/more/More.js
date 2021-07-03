import {useNavigation, useTheme} from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from "@react-navigation/native";
import {Text, View, TextInput, StyleSheet,Dimensions, TouchableOpacity, Pressable,Alert} from 'react-native';
import {BorderlessButton, ScrollView} from 'react-native-gesture-handler';
import {List, User, Box} from '../../components/base';
import {Colors} from '../../styles/colors';
import definitions from '../../styles/definitions';
import gStyles from '../../styles/gStyles';
import moreStyles from '../../styles/moreStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

let users = [];
let phoneNum;

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [userInfo,setUserInfo]=useState()
  const [status, setStatus] = useState("")
  const [trigger,setTrigger]=useState(true)
  const [profilePhoto, setProfilePhoto] = useState("")

  useFocusEffect(
    React.useCallback(() => {
      setTrigger(!trigger)
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <Text style={{color:'#fff', fontFamily:'GoogleSans-Regular', fontSize:16}} >Ayarlar</Text>,
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
          phoneNum=value
      }else{               
          //navigation.push('Login')
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
          users=documentSnapshot.data()
          setUserInfo(documentSnapshot.data())
          console.log("users:",users)
        }else{
          setTrigger(false)
        }
      });
  } catch (error) {
      console.log(error)
      setTrigger(false)
  }
}

  (otherSettings = [
    {
      title: 'UUD Web',
      icon: 'md-desktop-outline',
      onPress: null,
    },
    {
      title: 'Ayarlar',
      icon: 'md-settings-outline',
      onPress: null,
    },
    {
      title: 'Çıkış Yap',
      icon: 'log-out-outline',
      onPress: () => LogOut(),
    },
   
  ])

    const LogOut =async()=>{
      try {
        await AsyncStorage.removeItem('phoneNumber');
        navigation.navigate('Login');
        console.log("ok")
 
      } catch (e) {
         console.log(e)
        return false;
      }
    }

    const updateStatus = ()=>{
     if(status?.length>6){
      firestore()
      .collection('userList')
      .doc(phoneNum)
      .update({
        status:status,
      })
      .then(() => {
        setTrigger(!trigger)
        console.log('Ok updated!');
        setStatus(""),
        Alert.alert('Başarılı', 'Durum değiştirildi')
      });
     }else{
       Alert.alert("Durum güncellenemedi", "durum güncellenirken bir hata oluştu")
     }
    }

    const updateStatusPhoto = ()=>{
      if(profilePhoto?.length>6){
        firestore()
        .collection('userList')
        .doc(phoneNum)
        .update({
          photoUrl:profilePhoto,
        })
        .then(() => {
          setTrigger(!trigger)
          console.log('Ok updated!');
          setProfilePhoto(""),
          Alert.alert('Başarılı', 'Fotoğraf değiştirildi')
        });
       }else{
         Alert.alert("Fotoğraf güncellenemedi", "Fotoğraf güncellenirken bir hata oluştu")
       }
    }

  return (
    <ScrollView
      style={[gStyles.flex, {backgroundColor: theme.colors.backgroundLight}]}>
      <Box style={moreStyles.profileBox}>
        <User user={users} photoSize={70} />
      </Box>
      <Box>
        <View style={[ {padding:5}]}>
          <Text style={styles.statusText} > Sohbet durumunuzu güncelleyin!</Text>
          <TextInput
            value={status}
            onChangeText={(text)=>setStatus(text)}
            style={styles.textInput}
            keyboardType={'default'}
            multiline={false}
            placeholder={users.status}
            maxLength={90}
          />
          <TouchableOpacity onPress={()=>updateStatus()}  style={styles.submitButton} >
            <Text style={styles.buttonText} >Kaydet</Text>
          </TouchableOpacity>
        </View>
      </Box>


      <Box style={{marginTop:10}} >
        <View style={[ {padding:5}]}>
          <Text style={styles.statusText}>Profil resminizi değiştirin!</Text>
          <TextInput
            value={profilePhoto}
            onChangeText={(text)=>setProfilePhoto(text)}
            style={styles.textInput}
            keyboardType={'default'}
            multiline={false}
            placeholder={users.photoUrl}
          />
          <TouchableOpacity onPress={()=>updateStatusPhoto()}  style={styles.submitButton} >
            <Text style={styles.buttonText} >Değiştir</Text>
          </TouchableOpacity>
        </View>
      </Box>

      
      <View style={[gStyles.bgWhite, {marginTop: definitions.layout.gutters.xs}]}>
        <List list={otherSettings} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textInput:{
    width:Dimensions.get('screen').width-10,
    borderBottomWidth:0.3, 
    fontSize:14,
    borderColor:'#ccc',
    marginHorizontal:10,
    marginVertical:5,
    borderRadius:6,
    paddingHorizontal:0,
    paddingVertical:1,
},
statusText:{
  fontFamily:'GoogleSans-Regular',
  fontSize:12,
  paddingLeft:5,
  color:'#555',
  paddingTop:10,
},
submitButton:{
  paddingHorizontal:30,
  paddingVertical:10,
  backgroundColor:'#118ab2',
  width:Dimensions.get('screen').width-10,
  marginTop:10
},
buttonText:{
  fontFamily:'GoogleSans-Regular',
  textAlign:'center',
  fontSize:15,
  color:'#fff'
}
})
