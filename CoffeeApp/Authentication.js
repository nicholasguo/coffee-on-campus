import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    TextInput,
    PixelRatio, Text, Image
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Font } from 'expo';

import cssVar from './Lib/cssVar';

import Button from 'react-native-button'

export class LoggedOutScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: '', password: '', isLoading: true};
    }

    async componentWillMount(){
        await Font.loadAsync({
            'montserrat': require('./assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        });
        this.setState({isLoading: false});
    }

    static navigationOptions = {
        title: 'Please sign in or create an account',
    };

    render() {
        if (this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <Text style={[styles.input, {fontSize: 30}]}>{'Coffee on Campus'}</Text>
                <View style={{padding:25}}>
                    <Image
                        style={{width: 150, height: 150, borderRadius: 150/2}}
                        source={{uri: 'https://www.siliconvalleyandbeyond.com/wp-content/uploads/nathan-dumlao-287719-e1513904063816-495x400.jpg'}}
                    />
                </View>
                <Button containerStyle={{padding:5}} style={styles.input} onPress={this._goToSignIn}>Sign In</Button>
                <Button containerStyle={{padding:5}} style={styles.input} onPress={this._goToSignUp}>Create Account</Button>
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

export class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: '', password: '', email: ''};
    }

    static navigationOptions = {
        title: 'Create an Account',
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.input, {fontSize: 30}]}>{'Coffee on Campus'}</Text>
                <View style={{padding:25}}>
                    <Image
                        style={{width: 150, height: 150, borderRadius: 150/2}}
                        source={{uri: 'https://www.siliconvalleyandbeyond.com/wp-content/uploads/nathan-dumlao-287719-e1513904063816-495x400.jpg'}}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        textContentType='user'
                        autoCapitalize = 'none'
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={(user) => this.setState({user})}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        textContentType='email'
                        autoCapitalize = 'none'
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
                <Button containerStyle={{padding:5}} style={styles.input} onPress={this._signUpAsync}>Sign Up</Button>
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
                user: this.state.user,
                pass: this.state.password,
                email: this.state.email,
            }),
        });
        let responseJson = await response.json();
        if (responseJson.success == true) {
            await AsyncStorage.setItem('userToken', this.state.user);
            this.props.navigation.navigate('EditProfile', {userToken: this.state.user, user: this.state.user, newUser: true});
        } else {
            Alert.alert(responseJson.reason);
        }
    };
}

export class SignInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: '', password: ''};
    }

    static navigationOptions = {
        title: 'Sign in',
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.input, {fontSize: 30}]}>{'Coffee on Campus'}</Text>
                <View style={{padding:25}}>
                    <Image
                        style={{width: 150, height: 150, borderRadius: 150/2}}
                        source={{uri: 'https://www.siliconvalleyandbeyond.com/wp-content/uploads/nathan-dumlao-287719-e1513904063816-495x400.jpg'}}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        textContentType={'user'}
                        autoCapitalize = 'none'
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={(user) => this.setState({user})}
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
                <Button containerStyle={{padding:5}} style={styles.input} onPress={this._signInAsync}>Sign In</Button>
            </View>
        );
    }

    _signInAsync = async () => {
        let response = await fetch('http://127.0.0.1:5555/signin?'
            + 'user=' + this.state.user
            + '&pass=' + this.state.password
        );
        let responseJson = await response.json();
        if (responseJson.success === true) {
            await AsyncStorage.setItem('userToken', this.state.user);
            this.props.navigation.navigate('Home');
        } else {
            Alert.alert(responseJson.reason);
        }
    };
}


export class AuthLoadingScreen extends React.Component {
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
        backgroundColor: 'lightyellow'
    },
    input: {
        fontSize: 18,
        fontFamily: 'montserrat',
        //padding: 10,
        textAlign: 'center'
    },
    inputContainer: {
        borderWidth: 1 / PixelRatio.get(),
        borderColor: 'red',
        borderRadius: 6,
        height: 45,
        width: 250,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center',

    }
});