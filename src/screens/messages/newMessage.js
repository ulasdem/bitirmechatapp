import React,{useEffect, useState} from 'react';
import {View,StatusBar, StyleSheet, Dimensions, TouchableHighlight, TextInput, Text} from 'react-native';
import gStyles from '../../styles/gStyles';
import definitions from '../../styles/definitions';
import ContactList from '../../components/ContactList'

const NewMessageScreen = ({navigation, route}) => {

  return (
    <View style={{flex:1}}>
      <ContactList/>
    </View>
  );
};
export default NewMessageScreen;

const styles = StyleSheet.create({
  
});
