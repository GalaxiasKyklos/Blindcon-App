'use strict';

import React, { Component } from 'react';
import { AppRegistry, ListView, DeviceEventEmitter } from 'react-native';
import { ListPlaces, BeaconSensor, Heading, Directions } from './Components';
import Beacons from 'react-native-beacons-manager';
import { constants, instance as axios } from './utils';
import Graph from 'node-dijkstra';

const { LISTPLACES, BEACONSENSOR, DIRECTIONS } = constants;

const Components = {
  [LISTPLACES]: ListPlaces,
  [BEACONSENSOR]: BeaconSensor,
  [DIRECTIONS]: Directions,
};

class BlindconApp extends Component {
  constructor(props) {
    super(props);
    const listPlaceDs = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 }
    );
    const listRouteDs = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const graph = new Graph();

    this.state = {
      Current: Components[LISTPLACES],
      graph,
      currentBeacon: { uuid: 'none' },
      props: {
        places: listPlaceDs.cloneWithRows([]),
        routes: listRouteDs.cloneWithRows([]),
        text: 'hola',
      },
      placesList: [],
    };
  }

  componentWillMount = () => {
    Beacons.detectIBeacons();

    Beacons
      .startRangingBeaconsInRegion(
        'ITESO'
      )
      .then()
      .catch();
  }

  componentDidMount = () => {
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        const currentBeacon = data.beacons.length > 0 ? data.beacons[0] : { uuid: 'que Triste' };
        const place = this.state.placesList.find(p => p.beacon.id.toLowerCase() === currentBeacon.uuid.toLowerCase());

        if (currentBeacon.proximity && currentBeacon.uuid.toLowerCase() !== this.state.currentBeacon.uuid.toLowerCase()){
          this.setState({
            currentBeacon,
            props: {...this.state.props, text: place ? place.place : this.state.props.text },
          });
        }
        if (this.state.placesList.length > 2) {
          console.log('rutaaaa', this.state.graph.path(this.state.placesList[0].place, this.state.placesList[1].place));
        }
      }
    );

    axios.get('api/places').then(({data}) => {
      const graph = new Graph();
      data.forEach(place => {
        const routes = [];
        for (const key in place.links) {
          routes.push({ [key]: Number(place.links[key].weight) });
        }
        const links = routes.reduce((acc, current) => ({...acc, ...current}), {});
        graph.addNode(place.place, links);

      });
      console.log(graph);

      this.setState({
        graph,
        placesList: data,
        props: {
          ...this.state.props,
          places: this.state.props.places.cloneWithRows(data),
        }
      });
    }).catch(console.log);
  }

  componentWillUnMount(){
    DeviceEventEmitter.removeListener('beaconsDidRange');
    this.beaconsDidRange = null;
  }

  goToComponent = nextComponent => () => {
    this.setState({
      Current: Components[nextComponent],
    });
  }

  render() {
    const { Current } = this.state;

    return (
      <Heading>
        <Current {...this.state.props} change={this.goToComponent} />
      </Heading>
    );
  }
}

AppRegistry.registerComponent(
  'BlindconApp',
  () => BlindconApp
);
