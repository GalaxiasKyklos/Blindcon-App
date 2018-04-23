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

class Directions extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { currentPlace, route, sendLog } = nextProps;
    const index = route.findIndex(r => r === currentPlace.place);
    if (index === route.length - 1) {
      sendLog(false);
    }
  }

  getText(placesList, current, previous, next) {
    const { coords: currentPlace } = placesList.find(p => p.place === current);
    const { coords: previousPlace } = placesList.find(p => p.place === previous);
    const { coords: nextPlace } = placesList.find(p => p.place === next);
    const prevToCurr = Math.atan2(previousPlace.lon - currentPlace.lon, previousPlace.lat - currentPlace.lat);
    const currToNext = Math.atan2(currentPlace.lon - nextPlace.lon, currentPlace.lat - nextPlace.lat);
    const angle = currToNext - prevToCurr;
    const direction = angle <= 0.2 && angle >= -0.2 ? 'continua recto' :
                      angle > 0 ? 'da vuelta a la derecha' : 'da vuelta a la izquierda';
    return `Vas en direccion a ${next}, ${direction}`;
  }

  render() {
    const { buttonText, change, currentPlace, route, resetRoute, placesList } = this.props;
    let text = 'Obteniendo indicaciones';
    if (currentPlace.place && route.length > 0) {
      const index = route.findIndex(r => r === currentPlace.place);
      if (index === route.length - 1) {
        text = `Has llegado a ${route[index]}`;
      } else {
        if (index === 0) {
          text = `Estas en ${route[index]} en dirección a ${route[index + 1]}`;
        } else {
          text = this.getText(placesList, route[index], route[index - 1], route[index + 1]);
        }
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
  }
}

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
