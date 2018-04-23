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

const crossProduct = (a, b) => {
  const [a1, a2, a3] = a;
  const [b1, b2, b3] = b;
  return [ a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1 ];
};

class Directions extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { currentPlace, route, sendLog } = nextProps;
    const index = route.findIndex(r => r === currentPlace.place);
    if (index === route.length - 1) {
      sendLog(false);
    }
  }

  getText(placesList, currentPlace, previousPlace, nextPlace) {
    const { coords: current } = placesList.find(p => p.place === currentPlace);
    const { coords: previous } = placesList.find(p => p.place === previousPlace);
    const { coords: next } = placesList.find(p => p.place === nextPlace);
    const prevToCurr = [current.lon - previous.lon, current.lat - previous.lat, 0];
    const currToNext = [next.lon - current.lon, next.lat - current.lat, 0];
    const [ , , angle] = crossProduct(prevToCurr, currToNext);
    const direction = Math.abs(angle) <= 4e-9 ? 'sigue derecho' :
                      `da vuelta a la ${angle > 0 ? 'izquierda' : 'derecha'}`;
    return `Vas en direccion a ${nextPlace}, ${direction}`;
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
