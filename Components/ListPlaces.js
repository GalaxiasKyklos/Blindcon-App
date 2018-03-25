import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';

class ListPlaces extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.smallText}>Hola</Text>
        <Button
          title="Go to next page"
          onPress={this.props.change}
        />
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
  'ListPlaces',
  () => ListPlaces
);

export default ListPlaces;
