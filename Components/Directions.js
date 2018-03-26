import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { withVibration, } from '../utils';

class Directions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.directionContainer}>
          <Text style={styles.direction}>
            {this.props.text}
          </Text>
        </View>
        <Button
          title={this.props.buttonText}
          onPress={withVibration(this.props.change)}
        />
      </View>
    );
  }
}

Directions.defaultProps = {
  text: 'Getting directions, please wait',
  buttonText: 'Cancel',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  directionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    alignSelf: 'center',
    height: Dimensions.get('window').width * 0.8,
    width: Dimensions.get('window').width * 0.8,
    marginTop: 60,
  },
  direction: {
    fontSize: 30,
    textAlign: 'center',
  },
});

AppRegistry.registerComponent(
  'Directions',
  () => Directions
);


export default Directions;
