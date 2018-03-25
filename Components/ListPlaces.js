import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Vibration,
} from 'react-native';
import { getPlaces } from '../data-source';

class ListPlaces extends Component {
  constructor(props) {
    super(props);
    const places = getPlaces();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 }
    );
    this.state = {
      places: ds.cloneWithRows(places),
    };
  }

  render() {
    const { places } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>
          Chose a destination
        </Text>
        <ListView
          dataSource={places}
          enableEmptySections={true}
          renderRow={this.renderRow}
        />
        <Button
          title="Confirm"
          onPress={() => {
            Vibration.vibrate(100);
            this.props.change();
          }}
        />
      </View>
    );
  }

  renderRow = (rowData, sectionID, rowID) => {
    return (
      <TouchableHighlight style={styles.row} underlayColor="#FFF" onPress={this._handlePress(rowData)}>
        <Text style={styles.text}>
          {rowData.place}
        </Text>
      </TouchableHighlight>
    );
  }

  _handlePress = (rowData) => () => {
    console.log(rowData.place);
    Vibration.vibrate(100);
  }
}

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

AppRegistry.registerComponent(
  'ListPlaces',
  () => ListPlaces
);

export default ListPlaces;
