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

const chats = [
  {
    id: 1,
    message: 'naber',
    messageDate: '12:45',
    photo:
      'https://media.creativemornings.com/uploads/user/avatar/49419/Bechtel_Profile_Square.jpg',
    name: 'Emre Orhan',
  },
  {
    id: 2,
    message: 'naber2',
    messageDate: '12:45',
    photo:
      'https://media.creativemornings.com/uploads/user/avatar/49419/Bechtel_Profile_Square.jpg',
    name: 'Ali Parlak',
  },
];
const FirstRoute = () => <ChatList style={[styles.scene]} chats={data} />;
const SecondRoute = () => <ServicesScreen />;

const MessagesScreen = ({navigation, route}) => {
  const [index, setIndex] = React.useState(0);
  const {phone} = route.params;
  const [data, setData] = useState([]);
  const [routes] = React.useState([
    {key: 'first', title: 'Sohbetler '},
    {key: 'second', title: 'Servisler'},
  ]);
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });




  
  useEffect(() => {
    firestore()
    .collection('messageList')
    .doc(phone)
    .collection('messageUsername')
    .onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((documentSnapshot) => {
        users.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setData(users);
    });
  }, []);




  


  return (
    <View style={[gStyles.container]}>
      <StatusBar backgroundColor={'#118ab2'} />
      <View
        style={{
          zIndex: 1,
          position: 'absolute',
          bottom: definitions.layout.gutters.sm,
          right: definitions.layout.gutters.sm,
        }}>
        <Press
          circle
          style={[
            gStyles.floatButton,
            {
              backgroundColor: Colors.red,
              marginBottom: definitions.layout.gutters.xs,
            },
          ]}>
          <Icon name="md-rocket-outline" size={30} color={Colors.light} />
        </Press>
        {index == 0 ? (
          <Press
            circle
            style={[
              gStyles.floatButton,
              {
                backgroundColor: Colors.green,
                borderRadius: 100,
              },
            ]}>
            <Icon
              name="chatbox-ellipses-outline"
              size={30}
              color={Colors.light}
            />
          </Press>
        ) : (
          <Press
            circle
            style={[
              gStyles.floatButton,
              {
                backgroundColor: Colors.green,
                borderRadius: 100,
              },
            ]}>
            <Icon
              name="navigate-circle-outline"
              size={30}
              color={Colors.light}
            />
          </Press>
        )}
      </View>
      <Search phone={phone} data={data} />
      <ChatList style={[styles.scene]} data={data} phone={phone} />
    </View>
  );
};
export default MessagesScreen;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
