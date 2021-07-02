import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, Image, FlatList,StyleSheet, Dimensions,Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Logger from '../services/loggerService';
import definitions from '../styles/definitions';
import gStyles from '../styles/gStyles';
import {Press, User} from './base';

const ChatList = ({data, phone}) => {
  const navigation = useNavigation();

  const nameView = (item)=>{
   navigation.push('Chat',{item:item,phone:phone});
  } 
    
  return (
    <View style={{}}>
      <FlatList
        data={data}
        style={styles.flatlistCom}
        horizontal={false}
        renderItem={({item})=>(
          <TouchableOpacity onPress={()=>nameView(item)} activeOpacity={0.7} style={styles.itemContainer}>
            <Image
              style={styles.image}
              source={{uri : 'https://klimbim2014.files.wordpress.com/2018/01/atatuerk-bw.jpg'}}
            />
            <View style={{padding:10,}}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={[styles.text, {fontSize:10,color:'#555'}]}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatlistCom:{
    flexDirection:'row',
    width:Dimensions.get('screen').width,
  },

  itemContainer:{
    width:Dimensions.get('screen').width-10,
    //paddingVertical:30,
    //paddingHorizontal:30,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:5,
    marginHorizontal:5,
    borderBottomWidth:1,
    borderBottomColor:'#55555530'
    
  },

  image:{
    width:50,
    height:50,
    borderRadius:25
  },

  text:{
    width:Dimensions.get('screen').width-90,

  },
})

export default ChatList;
