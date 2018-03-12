import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';


class NextPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log(`::${this.props}`);
  }

  static navigationOptions = {
    title: 'Next',
  };
  render() {
    // StackNavigator **only** accepts a screenProps prop so we're passing
    // initialProps through that.
    return (
      <View style={styles.container}>
        <Text style={styles.smallText}>Hola</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  btleConnectionStatus: {
    // fontSize: 20,
    paddingTop: 20
  },
  headline: {
    fontSize: 20,
    paddingTop: 20
  },
  row: {
    padding: 8,
    paddingBottom: 16
  },
  smallText: {
    fontSize: 11
  },
  icon: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 100,
    justifyContent: 'center',
    position: 'absolute',
    width: 100
  }
});

AppRegistry.registerComponent(
  'NextPage',
  () => NextPage
);

export default NextPage;
