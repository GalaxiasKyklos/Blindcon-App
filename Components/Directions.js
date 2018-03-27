import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { withVibration, constants } from '../utils';

const Directions = ({ text, buttonText, change }) => (
  <View style={styles.container}>
    <View style={styles.directionContainer}>
      <Text style={styles.direction}>
        {text}
      </Text>
    </View>
    <Button
      title={buttonText}
      onPress={withVibration(change(constants.LISTPLACES))}
    />
  </View>
);

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

export default Directions;
