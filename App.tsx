/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Alert,
  GestureResponderEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Auth0, {UserInfo, UserInfoParams} from 'react-native-auth0';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
} from 'react-native/Libraries/NewAppScreen';
require('dotenv').config();

//#INFO: Set your auth0 domin and client id in .env.dev file and rename .env.dev to .env only
const auth0 = new Auth0({
  domain: process.env.OAUTH_DOMAIN?.toString() ?? '',
  clientId: process.env.CLIENT_ID?.toString() ?? '',
});

const Section: React.FC<{
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
}> = ({children, title, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [accessToken, setAccessToken] = useState<string>('');
  const [user, setUser] = useState<UserInfo>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onLogin = () => {
    auth0.webAuth
      .authorize({scope: 'openid profile email'})
      .then(credentials => {
        setAccessToken(credentials.accessToken);
        const userInfoParams: UserInfoParams = {token: credentials.accessToken};
        auth0.auth.userInfo(userInfoParams).then(u => {
          setUser(u);
          console.log(JSON.stringify(user));
        });
      })
      .catch(error => console.log(error));
  };

  const LogOut = () => {
    auth0.webAuth
      .clearSession(undefined)
      .then(success => {
        Alert.alert('Logged out!', success);
        setAccessToken('');
        setUser(undefined);
      })
      .catch(error => {
        console.log('Log out cancelled', error);
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Login" onPress={onLogin}>
            {accessToken
              ? `Hello, ${user?.name} with Auth0`
              : 'Click here to login with multiple types of providers'}
          </Section>

          {accessToken ? (
            <Section title="Logout" onPress={LogOut}>
              Logout using oAuth
            </Section>
          ) : null}

          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
