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
import { ProfileScreen, EditProfileScreen } from "./Profile";
import { MatchesScreen } from "./Matches";

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
                    title="Sign Out"
                />
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
                <Text style={{fontSize: 30, textAlign: 'center'}}>{'Welcome to\nCoffee on Campus!\n'}</Text>
                <Text style={{fontSize: 18, textAlign: 'center'}}>You are logged in as{'\n'}{this.state.userToken}{'\n'}</Text>
                <Button title="View your profile" onPress={this._showProfile} />
                <Button title="See my matches" onPress={this._showMatches} />
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
