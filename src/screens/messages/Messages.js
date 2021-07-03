import React,{useEffect, useState} from 'react';
import {View,StatusBar, StyleSheet, Dimensions, TouchableHighlight, TextInput, Text} from 'react-native';
import {SceneMap} from 'react-native-tab-view';
import ChatList from '../../components/ChatList';
import firestore from '@react-native-firebase/firestore';
import {Colors} from '../../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {ServicesScreen} from './Services';
import gStyles from '../../styles/gStyles';
import definitions from '../../styles/definitions';
import {Press} from '../../components/base';
import {useTheme} from '@react-navigation/native';
import Search from './Search';
import NewMessage from '../../components/newMessage'



const MessagesScreen = ({navigation, route}) => {
  const [index, setIndex] = React.useState(0);
  const {phone} = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    firestore()
    .collection('messageList')
    .doc(phone)
    .collection('messageUsername')
    .orderBy('date', 'desc')
    .onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((documentSnapshot) => {
        users.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setData(users);
      console.log(users)
    });
  }, []);


  return (
    <View style={[gStyles.container]}>
            <StatusBar backgroundColor={'#118ab2'} />
            <Search phone={phone} data={data} />

      { data.length<1
      ?
        <View style={{width:Dimensions.get('screen').width, height:Dimensions.get('screen').height*0.7, flexDirection:'column', justifyContent:'center', alignItems:'center'}} >
         <Icon name="navigate-circle-outline" size={70} color={'#333'}/>
         <Text style={styles.text} >Burada hiç mesaj yok</Text>
         <Text style={styles.textDes}  >Hemen bir mesaj göster</Text>
       </View>
       :null
      }
       <View style={styles.containerExp}>
       {index == 0 ? (
         <Press onPress={() => navigation.navigate('New Message')} style={[gStyles.floatButton,{backgroundColor: Colors.green,borderRadius: 100}]}>
           <Icon name="chatbox-ellipses-outline" size={30} color={Colors.light}/>
         </Press>
       ) : (
         <Press circle style={[ gStyles.floatButton,{backgroundColor: Colors.green,borderRadius: 100}]}>
           <Icon name="navigate-circle-outline" size={30} color={Colors.light}/>
         </Press>
       )}
     </View>
      
     
      <ChatList style={[styles.scene]} data={data} phone={phone} />
    </View>
  );
};
export default MessagesScreen;

const styles = StyleSheet.create({
  containerExp:{
    zIndex: 1,
    position: 'absolute',
    bottom: definitions.layout.gutters.sm,
    right: definitions.layout.gutters.sm,
  },
  scene: {
    flex: 1,
  },
  text:{
    fontFamily:'GoogleSans-Medium',
    fontSize:20
  },
  textDes:{
    fontFamily:'GoogleSans-Regular',
    fontSize:15,
    color:'#333'
  }
});
