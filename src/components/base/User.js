import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import definitions from '../../styles/definitions';
import gStyles from '../../styles/gStyles';
import {useTheme} from '@react-navigation/native';

export default ({user, photoSize}) => {
  const theme = useTheme();
  return (
    <View style={[gStyles.flex, gStyles.row]}>
      <View>
        <Image source={{uri: user.photoUrl,}} style={styles.image}/>
      </View>
      <View style={gStyles.profileInfo}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.status}>{user?.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image:{
    width:70,
    height:70,
    borderRadius:35
  },
  name:{
    color:'#333',
    fontFamily:'GoogleSans-Medium',
    fontSize:16
  },
  status:{
    color:'#333',
    fontFamily:'GoogleSans-Regular',
    fontSize:14
  }
})
