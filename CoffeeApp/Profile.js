import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Button,
    Image,
    StatusBar,
    StyleSheet,
    View,
    TextInput,
    PixelRatio, Text
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Font } from 'expo';

export class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        if (navigation.getParam('userToken', 'None') == navigation.getParam('user', 'None'))
            return {
                title: 'Profile',
                headerRight: (
                    <Button
                        onPress={async () => {
                            navigation.navigate('EditProfile', navigation.state.params);
                        }}
                        title="Edit"
                    />
                ),
            };
        return {
            title: navigation.getParam('user', 'None') + '\'s profile',
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {user: navigation.getParam('user', 'None'), isLoading: true};
    }

    async getProfile() {
        let response = await fetch('http://127.0.0.1:5555/get_profile?'
            + 'user=' + this.state.user
        );
        let responseJson = await response.json();
        this.setState(responseJson);
        this.props.navigation.state.params.isLoading = false;
    }

    async componentDidMount(){
        await this.getProfile();
        console.log(this.state.image)
    }

    async componentDidUpdate(){
        if (this.props.navigation.getParam('isLoading')) {
            await this.getProfile();
        }
    }

    render() {
        if (this.props.navigation.getParam('isLoading')) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={[styles.input, {fontSize: 30}]}>{this.state.name}</Text>
                </View>
                <View style={{flex: 3, justifyContent: 'center'}}>
                    <Image
                        style={{width: 200, height: 200, borderRadius: 200/2}}
                        source={{uri: this.state.image}}
                    />
                </View>
                <View style={{flex: 1.5, flexDirection: 'row', justifyContent: 'center'}}>

                    <View style={{flex: 1, alignItems: 'center', borderWidth: 1 / PixelRatio.get()}}>
                        <Text style={[styles.input]}>School:</Text>
                        <Text style={[styles.input]}>{this.state.college}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', borderWidth: 1 / PixelRatio.get()}}>
                        <Text style={[styles.input]}>Class:</Text>
                        <Text style={[styles.input]}>{this.state.year}</Text>
                    </View>

                </View>
                <View style={{flex: 1.5, flexDirection: 'row', justifyContent: 'center'}}>

                    <View style={{flex: 1, alignItems: 'center', borderWidth: 1 / PixelRatio.get()}}>
                        <Text style={[styles.input]}>Major:</Text>
                        <Text style={[styles.input]}>{this.state.major}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', borderWidth: 1 / PixelRatio.get()}}>
                        <Text style={[styles.input]}>Fun Fact:</Text>
                        <Text style={[styles.input]}>{this.state.description}</Text>
                    </View>

                </View>
                <StatusBar barStyle="default" />
            </View>
        );
    }

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
}

export class EditProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('newUser', false) ? 'Create your profile' : 'Edit your profile',
            headerRight: (
                <Button
                    onPress={async () => {
                        let response = await fetch('http://127.0.0.1:5555/update_profile', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                user: navigation.getParam('user'),
                                name:  navigation.getParam('name'),
                                college:  navigation.getParam('college'),
                                year:  navigation.getParam('year'),
                                major:  navigation.getParam('major'),
                                description:  navigation.getParam('description')
                            }),
                        });
                        let responseJson = await response.json();
                        if (responseJson.success == true) {
                            if (navigation.getParam('newUser', false)) {
                                navigation.navigate('Home');
                            } else {
                                navigation.navigate('Profile', {isLoading: 'true'});
                            }
                        } else {
                            Alert.alert(responseJson.reason);
                        }
                    }}
                    title="Save"
                />
            ),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {user: navigation.getParam('user', 'None')};
    }

    async componentDidMount() {
        let response = await fetch('http://127.0.0.1:5555/get_profile?'
            + 'user=' + this.state.user
        );
        let responseJson = await response.json();
        this.setState(responseJson);
        this.setState({isLoading: false});
    }

    render() {
        if (this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        return (
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <TextInput style={[styles.input, {fontSize: 30}]} defaultValue={this.state.name}
                               placeholder="Enter your name"
                               onChangeText={(name) => {this.setState({name}); this.props.navigation.setParams({name});}}/>
                </View>
                <View style={{flex: 3, justifyContent: 'center'}}>
                    <Image
                        style={{width: 200, height: 200, borderRadius: 200/2}}
                        source={{uri: this.state.image}}
                    />
                </View>
                <View style={{flex: 1.5, flexDirection: 'row', justifyContent: 'center'}}>

                    <View style={{flex: 1, alignItems: 'center', borderWidth: 1 / PixelRatio.get()}}>
                        <Text style={[styles.input]}>School:</Text>
                        <TextInput style={[styles.input]}
                                   multiline={true}
                                   defaultValue={this.state.college}
                                   placeholder="Enter the school you attend"
                                   onChangeText={(college) => {this.setState({college}); this.props.navigation.setParams({college});}}/>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', borderWidth: 1 / PixelRatio.get()}}>
                        <Text style={[styles.input]}>Class:</Text>
                        <TextInput style={[styles.input]}
                                   multiline={true}
                                   defaultValue={this.state.year}
                                   placeholder="Enter your graduation year"
                                   onChangeText={(year) => {this.setState({year}); this.props.navigation.setParams({year});}}/>
                    </View>

                </View>
                <View style={{flex: 1.5, flexDirection: 'row', justifyContent: 'center'}}>
                    <View style={{flex: 1, alignItems: 'center', borderWidth: 1 / PixelRatio.get()}}>
                        <Text style={[styles.input]}>Major:</Text>
                        <TextInput style={[styles.input]}
                                   multiline={true}
                                   defaultValue={this.state.major}
                                   placeholder="What's your major"
                                   onChangeText={(major) => {this.setState({major}); this.props.navigation.setParams({major});}}/>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', borderWidth: 1 / PixelRatio.get()}}>
                        <Text style={[styles.input]}>Fun Fact:</Text>
                        <TextInput style={[styles.input]}
                                   multiline={true}
                                   defaultValue={this.state.description}
                                   placeholder="Tell us a fun fact about yourself"
                                   onChangeText={(description) => {this.setState({description}); this.props.navigation.setParams({description});}}/>
                    </View>
                </View>
                <StatusBar barStyle="default" />
            </KeyboardAwareScrollView>
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
        backgroundColor: 'white'
    },
    input: {
        fontSize: 18,
        fontFamily: 'montserrat',
        textAlign: 'center'
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