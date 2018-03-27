import React from 'react';
import {
  Button,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { withVibration, constants } from '../utils';

const handlePress = (rowData) => () => {
  withVibration(console.log)(rowData.place);
};

const renderRow = (rowData, sectionID, rowID) => (
  <TouchableHighlight style={styles.row} underlayColor="#FFF" onPress={handlePress(rowData)}>
    <Text style={styles.text}>
      {rowData.place}
    </Text>
  </TouchableHighlight>
);

const ListPlaces = ({ change, places }) => (
  <View style={styles.container}>
    <Text style={styles.headline}>
      Chose a destination
    </Text>
    <ListView
      dataSource={places}
      enableEmptySections={true}
      renderRow={renderRow}
    />
    <Button
      title="Confirm"
      onPress={withVibration(change(constants.DIRECTIONS))}
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
