import React from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  PixelRatio
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import cssVar from './Lib/cssVar';

class LoggedOutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
  }

  static navigationOptions = {
    title: 'Please sign in or create an account',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._goToSignIn} />
        <Button title="Create Account" onPress={this._goToSignUp} />
      </View>
    );
  }

  _goToSignIn = () => {
    this.props.navigation.navigate('SignIn');
  };

  _goToSignUp = () => {
    this.props.navigation.navigate('SignUp');
  };
}

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
  }

  static navigationOptions = {
    title: 'Create an Account',
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            textContentType='username'
            autoCapitalize = 'none'
            style={styles.input}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            textContentType='email'
            keyboardType='email-address'
            style={styles.input}
            placeholder="Email"
            onChangeText={(email) => this.setState({email})}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            textContentType='password'
            secureTextEntry = {true}
            style={styles.input}
            placeholder="Password"
            onChangeText={(password) => this.setState({password})}
          />
        </View>
        <Button title="Sign up!" onPress={this._signUpAsync} />
      </View>
    );
  }

  _signUpAsync = async () => {
    let response = await fetch('http://127.0.0.1:5555/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.username,
        pass: this.state.password,
        email: this.state.email,
      }),
    });
    let responseJson = await response.json();
    if (responseJson.success == true) {
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('App');
    } else {
      Alert.alert('SignUp Failed!');
    }
  };
}

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
  }

  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            textContentType={'username'}
            autoCapitalize = 'none'
            style={styles.input}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            textContentType={'password'}
            secureTextEntry = {true}
            style={styles.input}
            placeholder="Password"
            onChangeText={(password) => this.setState({password})}
          />
        </View>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    let response = await fetch('http://127.0.0.1:5555/signin?' 
      + 'user=' + this.state.username
      + '&pass=' + this.state.password
    )
    let responseJson = await response.json();
    console.log(responseJson.success)
    if (responseJson.success == true) {
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('App');
    } else {
      Alert.alert('SignIn Failed!');
    }
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Lots of features here',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 18,
    //padding: 10,
    marginHorizontal: 10
  },
  inputContainer: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'red',
    borderRadius: 6,
    height: 45,
    width: 250,
    margin: 2
  }
});

const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = createStackNavigator({ LoggedOut: LoggedOutScreen, SignIn: SignInScreen, SignUp: SignUpScreen });

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
