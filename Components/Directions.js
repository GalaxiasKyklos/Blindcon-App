import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { withVibration, constants } from '../utils';

const handleCancel = (change, reset) => () => {
  change();
  reset();
};

const Directions = ({ buttonText, change, currentPlace, route, resetRoute, sendLog }) => {
  let text = 'Obteniendo indicaciones';
  if (currentPlace.place && route.length > 0){
    const index = route.findIndex(r => r === currentPlace.place);
    if (index === route.length - 1){
      sendLog(false);
      text = `Has llegado a ${route[index]}`;
    } else {
      text = `Estas en ${route[index]} en dirección a ${route[index + 1]}`;
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.directionContainer}>
        <Text style={styles.direction}>
          {text}
        </Text>
      </View>
      <Button
        title={buttonText}
        onPress={withVibration(handleCancel(change(constants.LISTPLACES), resetRoute))}
      />
    </View>
  );
};

Directions.defaultProps = {
  buttonText: 'Elegir otro destino',
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
