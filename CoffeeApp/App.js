import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Button,
    StatusBar,
    StyleSheet,
    View,
    Text,
    TextInput,
    PixelRatio
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import cssVar from './Lib/cssVar';

import { LoggedOutScreen, SignUpScreen, SignInScreen, AuthLoadingScreen } from './Authentication'

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Home',
            headerRight: (
                <Button
                    onPress={async () => {
                        await AsyncStorage.clear();
                        navigation.navigate('Auth');
                    }}
                    title="Log Out"
                    color="#000"
                />
            ),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {user: '', isLoading: true};
    }

    async componentWillMount(){
        let user = await AsyncStorage.getItem('userToken');
        this.setState({user: user, isLoading: false});
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 30}}>Welcome to frinder, {this.state.user}!</Text>
                <Button title="Show me more of the app" onPress={this._showMoreApp} />
                <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
            </View>
        );
    }

    _showMoreApp = () => {
        this.props.navigation.navigate('Profile', {user: this.state.user});
    };

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
}

class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('user', 'None') + '\'s profile',
            headerRight: (
                <Button
                    onPress={async () => {
                        await AsyncStorage.clear();
                        navigation.navigate('Auth');
                    }}
                    title="Log Out"
                    color="#000"
                />
            ),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {user: navigation.getParam('user', 'None'), isLoading: true};
    }

    componentDidMount(){
        return fetch('https://facebook.github.io/react-native/movies.json')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson.movies,
                }, function(){

                });

            })
            .catch((error) =>{
                console.error(error);
            });
    }

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

/**
 * class App extends React.Component {
 *     state: {
 *         user?: User
 *     }
 *
 *     render () {
 *         const { user, page } = this.state
 *
 *         if (user) {
 *             return <HomeScreen user={user} />
 *         } else {
 *             return <LoggedOutScreen />
 *         }
 *     }
 * }
 */

const AppStack = createStackNavigator({ Home: HomeScreen, Profile: ProfileScreen });
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
