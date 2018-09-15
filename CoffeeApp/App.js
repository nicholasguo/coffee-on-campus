import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Text,
    TextInput,
    PixelRatio, Image
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import Button from 'react-native-button';

import { Font } from 'expo';

import { LoggedOutScreen, SignUpScreen, SignInScreen, AuthLoadingScreen } from './Authentication'
import { ProfileScreen, EditProfileScreen } from "./Profile";
import { MatchesScreen } from "./Matches";

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Home',
            headerRight: (
                <Button
                    //style={}
                    onPress={async () => {
                        await AsyncStorage.clear();
                        navigation.navigate('Auth');
                    }}
                >Sign Out   </Button>
            ),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {userToken: '', isLoading: true};
    }

    async componentWillMount(){
        let userToken = await AsyncStorage.getItem('userToken');
        await Font.loadAsync({
            'montserrat': require('./assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        });
        this.setState({userToken: userToken, isLoading: false});
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
                <Text style={[styles.input, {fontSize: 30}]}>{'Welcome to\nCoffee on Campus!'}</Text>
                <View style={{padding:25}}>
                    <Image
                        style={{width: 150, height: 150, borderRadius: 150/2}}
                        source={{uri: 'https://www.siliconvalleyandbeyond.com/wp-content/uploads/nathan-dumlao-287719-e1513904063816-495x400.jpg'}}
                    />
                </View>
                <Text style={[styles.input]}>You are logged in as{'\n'}{this.state.userToken}{'\n'}</Text>
                <Button containerStyle={{padding:5}} style={styles.input} onPress={this._showProfile}>View your profile</Button>
                <Button containerStyle={{padding:5}} style={styles.input} onPress={this._showMatches}>See my matches</Button>
            </View>
        );
    }

    _showProfile = () => {
        this.props.navigation.navigate('Profile', {user: this.state.userToken, userToken: this.state.userToken, isLoading: true});
    };

    _showMatches = () => {
        this.props.navigation.navigate('Matches', {userToken: this.state.userToken, isLoading: true});
    };

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
        backgroundColor: 'lightyellow'
    },
    input: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'montserrat',
        fontWeight: 'normal'

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

const AppStack = createStackNavigator({ Home: HomeScreen, Profile: ProfileScreen, EditProfile: EditProfileScreen, Matches: MatchesScreen });
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
