import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Text,StatusBar, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/colors';
import gStyles from '../../styles/gStyles';

const styles = StyleSheet.create({
  mainText: {
    fontSize: 23,
    color: Colors.green,
    marginBottom: 15,
    fontFamily: 'GoogleSans-Bold',
    textAlign: 'center',
  },
  subText: {
    fontSize: 22,
    letterSpacing: 0.3,
    fontFamily: 'GoogleSans-Bold',
    textAlign: 'center',
    lineHeight: 32,
  },
  navigateIcon: {
    paddingHorizontal: 10,
  },
});
export const ServicesScreen = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        gStyles.flexCenter,
        {
          width: '80%',
          marginTop: -50,
          alignSelf: 'center',
        },
      ]}>
        <StatusBar backgroundColor={'#118ab2'} />
      <View style={gStyles.row}>
        <Text style={[styles.subText, {color: theme.colors.text}]}>
          {'Burada hiç arama\n görünmüyor'}
          <View style={styles.navigateIcon}>
            <Icon
              name={'md-navigate-circle-outline'}
              size={28}
              color={Colors.green}
            />
          </View>
          arama yapmak için hemen başlayın
        </Text>
      </View>
    </View>
  );
};
