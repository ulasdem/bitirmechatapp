import  React,{useEffect,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, Image, TextInput, SafeAreaView, Dimensions} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useTheme,
} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MessagesScreen from './src/screens/messages/Messages';
import NewMessagesScreen from './src/screens/messages/newMessage';
import SignIn from './src/screens/login/SignIn';
import ChatScreen from './src/screens/messages/Chat';
import LoginScreen from './src/screens/login/LoginScreen';
import EntryScreen from './src/screens/login/EntryScreen';
import {ServicesScreen} from './src/screens/messages/Services';
import {
  Colors,
  NightColorTheme,
  NativeColorTheme,
  LavenderTheme,
} from './src/styles/colors';
import {ContactUserSearchScreen} from './src/screens/contact/ContactUserSearchScreen';
import definitions from './src/styles/definitions';
import gStyles from './src/styles/gStyles';
import {Chat} from './src/screens/messages/Chat';
import {Press} from './src/components/base';
import MoreScreen from './src/screens/more/More';
import RecentCallScreen from './src/screens/calls/RecentCalls';
import CallUserScreen from './src/screens/calls/CallUser';
import SettingsScreen from './src/screens/settings/Settings';
import Appearance from './src/screens/settings/Appearance';

export const ThemeContext = React.createContext(null);

function HomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

const BibLogo = () => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Image
        // source={require('../../logo.png')}
        source={{
          uri: 'https://i.ibb.co/JmNH3bB/logo.png',
        }}
        style={{
          width: 48,
          height: 36,
          marginLeft: 15,
        }}
      />
    </View>
  );
};

const screenOptions = {
  headerTitleStyle: {
    fontWeight: 'normal',
    fontSize: 19,
  },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
};

const AppStack = createStackNavigator();
const AppStackScreen = () => {
  const theme = useTheme();
  const [isPhoneNumber,setPhoneNumber]=useState(true)

    return (
      <AppStack.Navigator
        mode="card"
        initialRouteName={'EntryScreen'}
        screenOptions={{
          ...screenOptions,
          headerStyle: {backgroundColor: theme.colors.card},
        }}>
        <AppStack.Screen
          name="Home"
          component={MessagesScreen}
          options={({route, navigation}) => ({
            title: 'Mesajlar',
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            headerLeft: () => <BibLogo />,
            headerRight: () => (
              <Press
                circle
                style={{padding: 10}}
                onPress={null}>
                <Icon name={'search'} size={24} color={Colors.light} />
              </Press>
            ),
          })}
        />

        <AppStack.Screen name="New Message" component={NewMessagesScreen}/>
        <AppStack.Screen name="Calls" component={HomeScreen} />
        <AppStack.Screen name="Chat" component={ChatScreen} />
        <AppStack.Screen name="EntryScreen" component={EntryScreen} options={{headerShown:false}} />
        <AppStack.Screen name="Login" component={LoginScreen}
          options={({route, navigation}) => ({
            title: 'Giri?? Yap',
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
          })} /> 
          <AppStack.Screen name="SignIn" component={SignIn} 
          options={({route, navigation}) => ({
            title: 'Kay??t Ol',
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
          })} />
        <AppStack.Screen name="Services" component={ServicesScreen} />
        <AppStack.Screen
          name="ContactUserSearchScreen"
          options={{
            title: 'Search',
            header: (props) => (
              <View
                style={[
                  gStyles.row,
                  {
                    backgroundColor: theme.colors.background,
                    borderBottomColor: theme.colors.border,
                    borderBottomWidth: 1,
                  },
                ]}>
                 
                <HeaderBackButton
                  {...props}
                  onPress={() => props.navigation.goBack()}
                />
                <TextInput
                  placeholder="Search..."
                  autoFocus
                  onChangeText={(value) =>
                    props.navigation.setParams({headerInputText: value})
                  }
                  placeholderTextColor={theme.colors.text}
                  value={props.navigation.headerInputText}
                  style={{
                    color: theme.colors.text,
                  }}
                />
              </View>
            ),
          }}
          component={ContactUserSearchScreen}
        />
      </AppStack.Navigator>
    )
  
};

const ChatStack = createStackNavigator();
const ChatStackScreen = () => {
  const theme = useTheme();
  return (
    <ChatStack.Navigator
      mode="card"
      screenOptions={{
        ...screenOptions,
        headerStyle: {backgroundColor: theme.colors.card},
      }}>
      <ChatStack.Screen
        name=""
        component={ChatScreen}
        options={({route, navigation}) => ({
          title: '',
          headerLeft: (props) => (
            <View style={gStyles.row}>
              <HeaderBackButton
                {...props}
                onPress={() => navigation.goBack()}
              />
              <View style={[gStyles.row, gStyles.alignHorizontalCenter]}>
                <Image
                  source={{
                    uri: route?.params?.photo,
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 99,
                  }}
                />
                <View
                  style={[
                    gStyles.column,
                    {marginLeft: definitions.layout.gutters.xs},
                  ]}>
                  <Text style={gStyles.userNameTextHeader}>
                    {route?.params?.name}
                  </Text>
                  <Text style={gStyles.userLastSeenTextHeader}>
                    {route?.params?.messageDate}
                  </Text>
                </View>
              </View>
            </View>
          ),
          headerRight: (props) => (
            <View style={gStyles.row}>
              <Press
                circle
                style={gStyles.actionIcon}
                onPress={() => navigation.navigate('ContactUserSearchScreen')}>
                <Icon name={'videocam'} size={22} color={Colors.light} />
              </Press>
              <Press
                circle
                style={gStyles.actionIcon}
                onPress={() => navigation.navigate('CallUser')}>
                <Icon name={'call'} size={22} color={Colors.light} />
              </Press>
              <Press
                circle
                style={gStyles.actionIcon}
                onPress={() => navigation.navigate('ContactUserSearchScreen')}>
                <Icon name={'menu'} size={22} color={Colors.light} />
              </Press>
            </View>
          ),
        })}
      />
    </ChatStack.Navigator>
  );
};

const CallStack = createStackNavigator();
const CallStackScreen = () => {
  const theme = useTheme();
  return (
    <CallStack.Navigator
      mode="card"
      screenOptions={{
        ...screenOptions,
        headerStyle: {backgroundColor: theme.colors.card},
      }}>
      <CallStack.Screen
        component={RecentCallScreen}
        name="Calls"
        options={({route, navigation}) => ({
          title: 'Aramalar',
          headerLeft: () => <BibLogo />,
          headerRight: () => (
            <Press
              circle
              style={{padding: 10}}
              onPress={() => navigation.navigate('ContactUserSearchScreen')}>
              <Icon name={'search'} size={24} color={Colors.light} />
            </Press>
          ),
        })}
      />
    </CallStack.Navigator>
  );
};

const MoreStack = createStackNavigator();
const MoreStackScreen = () => {
  const theme = useTheme();
  return (
    <MoreStack.Navigator
      mode="card"
      screenOptions={{
        ...screenOptions,
        headerStyle: {backgroundColor: theme.colors.card},
      }}>
      <MoreStack.Screen
        component={MoreScreen}
        name="More"
        options={{
          headerLeft: () => <BibLogo />,
          title: 'More',
        }}
      />
      <MoreStack.Screen
        component={SettingsScreen}
        name="Settings"
        options={{
          headerTitleAlign: 'left',
          title: 'Settings',
        }}
      />
      <MoreStack.Screen
        component={Appearance}
        name="Appearance"
        options={{
          headerTitleAlign: 'left',
          title: 'Appearance',
        }}
      />
    </MoreStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const Root = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let iconSize = 20;

          if (route.name === 'Mesajlar') {
            iconName = 'mail-outline';
          } else if (route.name === 'Aramalar') {
            iconName = 'call-outline';
          } else if (route.name === 'Ayarlar') {
            iconSize = 20;
            iconName = 'settings-outline';
          }
          return <Icon name={iconName} size={iconSize} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        inactiveTintColor: Colors.grey,
       // showLabel:false,
        labelStyle: {
          width:Dimensions.get('screen').width/3,
          paddingTop: 4,
          fontWeight: 'normal',
        },
        keyboardHidesTabBar: true,
        style: {height: 60, borderTopColor: theme.colors.border},
        tabStyle: {
          paddingTop: 8,
          paddingBottom: 6,
          backgroundColor: theme.colors.background,
        },
      }}>
      <Tab.Screen name="Mesajlar" component={AppStackScreen} />
      <Tab.Screen name="Aramalar" component={CallStackScreen} />
      <Tab.Screen name="Ayarlar" component={MoreStackScreen} />
    </Tab.Navigator>
  );
};

const RootStack = createStackNavigator();
const main = () => {
  const [theme, setTheme] = useState('light');

  setNativeTheme = () => {
    setTheme('light');
  };
  setDarkTheme = () => {
    setTheme('dark');
  };
  setLavenderTheme = () => {
    setTheme('lavender');
  };

  getTheme = (theme) => {
    let newTheme;
    switch (theme) {
      case 'dark':
        newTheme = NightColorTheme;
        break;
      case 'lavender':
        newTheme = LavenderTheme;
        break;
      default:
        newTheme = NativeColorTheme;
        break;
    }
    return newTheme;
  };

  return (
    <ThemeContext.Provider
      value={{theme: theme, setLavenderTheme, setDarkTheme, setNativeTheme}}>
      <NavigationContainer theme={getTheme(theme)}>
        <RootStack.Navigator headerMode="none">
          <RootStack.Screen name="Messages" component={Root} />
          <RootStack.Screen name="ChatStack" component={ChatStackScreen} />
          <RootStack.Screen name="More" component={MoreStackScreen} />
          <RootStack.Screen name="CallUser" component={CallUserScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};

export default main;
