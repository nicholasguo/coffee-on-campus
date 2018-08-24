import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Button,
    StatusBar,
    StyleSheet,
    View,
    FlatList,
    TextInput,
    PixelRatio, Text
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, withNavigation } from 'react-navigation';

class MatchItem extends React.Component {
    constructor(props) {
        super(props);
        this.state={'user': this.props.user, 'userToken': this.props.userToken};
    }

    async getProfile() {
        let response = await fetch('http://127.0.0.1:5555/get_profile?'
            + 'user=' + this.state.user
        );
        let responseJson = await response.json();
        this.setState(responseJson);
    }

    async componentDidMount(){
        await this.getProfile();
    }

    render() {
        return (
            <View style={[{flex: 1, flexDirection: 'row'}, styles.match]}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={styles.item}>{this.state.name}</Text>
                    </View>
                    <View style={{flex: 4, backgroundColor: 'powderblue', width: 160}}>
                        <Text style={styles.item}>Picture</Text>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Button title="View profile" onPress={this._showProfile} />
                    <Button title="Chat this person" onPress={this._showProfile} />
                </View>

            </View>
        );
    }

    _showProfile = () => {
        this.props.navigation.navigate('Profile', {user: this.state.user, userToken: this.state.userToken, isLoading: true});
        console.log(this.state.userToken)
    };
}

class MatchRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state={'isLoading': true, 'userToken': this.props.userToken};
    }

    async componentDidMount() {
        let response = await fetch('http://127.0.0.1:5555/waiting_for_match?'
            + 'user=' + this.state.userToken
        );
        let responseJson = await response.json();
        this.setState(responseJson);
        this.setState({isLoading: false});
    }

    async componentDidUpdate() {
        if (this.state.isLoading) {
            console.log(this.state.waiting)
            let response = await fetch('http://127.0.0.1:5555/waiting_for_match?'
                + 'user=' + this.state.userToken
            );
            let responseJson = await response.json();
            this.setState(responseJson);
            this.setState({isLoading: false});
        }
    }

    _requestMatch = async () => {
        let response = await fetch('http://127.0.0.1:5555/request_match', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: this.state.userToken
            }),
        });
        let responseJson = await response.json();
        if (responseJson.success == true) {
            this.setState({isLoading: true});
        } else {
            Alert.alert(responseJson.reason);
        }
    };

    render() {
        if (this.state.isLoading) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        if (this.state.waiting) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.item}>{this.state.reason}</Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.item}>You are currently not looking for a match</Text>
                    <Button
                        onPress={this._requestMatch}
                        title="Find a match"
                    />
                </View>
            </View>
        );
    }
}

export class MatchesScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Your Matches',
        };
    };

    constructor(props) {
        super(props);
        this.state={'userToken': this.props.navigation.getParam('userToken'), isLoading: true};
    }

    async componentDidMount() {
        let response = await fetch('http://127.0.0.1:5555/get_matches?'
            + 'user=' + this.state.userToken
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
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <MatchRequest userToken={this.state.userToken}/>
                </View>
                <View style={{flex: 7}}>
                    <FlatList
                        data={this.state.matches}
                        renderItem={({item}) => <MatchItem navigation={this.props.navigation} userToken={this.state.userToken} user={item.key}/>}//<Text style={styles.item}>{item.key}</Text>}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
    },
    match: {
        borderWidth: 1 / PixelRatio.get(),
        borderColor: 'red',
        height: 180,
    },
    item: {
        fontSize: 18,
    },
})