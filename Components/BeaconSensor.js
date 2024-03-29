import React, { Component } from 'react';
import { StyleSheet, Text, ListView, View, DeviceEventEmitter, Button } from 'react-native';
import Beacons from 'react-native-beacons-manager';

class BeaconSensor extends Component {
  constructor(props) {
    super(props);
    // Create our dataSource which will be displayed in the ListView
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 }
    );
    this.state = {
      // region information
      uuidRef: ['6ebca247-81ae-40f5-b1b9-1dd796b17b80', 'b24b65c2-92ee-42df-b161-477e9b7a4e7c'],     // React Native ListView datasource initialization
      dataSource: ds.cloneWithRows([])
    };
  }

  componentWillMount() {
    //
    // ONLY non component state aware here in componentWillMount
    //
    Beacons.detectIBeacons();

  //  const uuid = this.state.uuidRef;
    Beacons
      .startRangingBeaconsInRegion(
        'ITESO'
      )
      .then()
      .catch();
  }

  componentDidMount() {
    //
    // component state aware here - attach events
    //
    // Ranging:
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data.beacons)
        });
      }
    );
  }

  componentWillUnMount(){
    DeviceEventEmitter.removeListener('beaconsDidRange');
    this.beaconsDidRange = null;
  }

  render() {
    const { dataSource } =  this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>
          All beacons in the area
        </Text>
        <ListView
          dataSource={ dataSource }
          enableEmptySections={ true }
          renderRow={this.renderRow}
        />
        <Button
          title="Go to next page"
          onPress={this.props.change}
        />
      </View>
    );
  }

  renderRow = rowData => {
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>
          UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Major: {rowData.major ? rowData.major : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Minor: {rowData.minor ? rowData.minor : 'NA'}
        </Text>
        <Text>
          RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
        </Text>
        <Text>
          Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
        </Text>
        <Text>
          Distance: {rowData.distance ? rowData.distance : 'NA'}
        </Text>
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

export default BeaconSensor;
