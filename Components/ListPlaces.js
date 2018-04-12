import React from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { withVibration, constants } from '../utils';

const handlePress = (rowData, setDestination, change) => () => {
  withVibration(setDestination)(rowData.place);
  change();
};

const renderRow = (setDestination, change) => (rowData, sectionID, rowID) => (
  <TouchableHighlight style={styles.row} underlayColor="#FFF" onPress={handlePress(rowData, setDestination, change)}>
    <Text style={styles.text}>
      {rowData.place}
    </Text>
  </TouchableHighlight>
);

const ListPlaces = ({ change, places, setDestination }) => (
  <View style={styles.container}>
    <Text style={styles.headline}>
      Selecciona tu destino
    </Text>
    <ListView
      dataSource={places}
      enableEmptySections
      renderRow={renderRow(setDestination, change(constants.DIRECTIONS))}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  headline: {
    fontSize: 25,
    alignSelf: 'center',
    padding: 16,
  },
  row: {
    padding: 16,
    marginBottom: 10,
    flex: 1,
    alignItems : 'center',
    backgroundColor: '#E1EEF4',
  },
  text: {
    fontSize: 20,
  },
});

export default ListPlaces;
