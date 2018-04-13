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
    const graph = new Graph();

    this.state = {
      Current: Components[LISTPLACES],
      graph,
      props: {
        places: listPlaceDs.cloneWithRows([]),
        text: 'hola',
      },
      placesList: [],
      destination: null,
      currentPlace: { beacon:{ id: ''}},
      origin: null,
      route: [],
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
        console.log(data);
        if (data.beacons.length === 0) {
          return;
        }
        let route = this.state.route;
        const currentBeacon =  data.beacons[0];
        const place = this.state.placesList.find(p => p.beacon.id.toLowerCase() === currentBeacon.uuid.toLowerCase());

        if (this.state.origin && this.state.destination && route.length === 0) {
          route = this.calculateRoute();
        }

        if (currentBeacon.uuid.toLowerCase() !== this.state.currentPlace.beacon.id.toLowerCase() || route.length > 0){
          this.setState({
            props: {...this.state.props, text: place ? place.place : this.state.props.text },
            currentPlace: place ? place : { beacon: { id: ''}},
            origin: this.state.origin && route.length !== 0 ? this.state.origin : place ? place.place : this.state.origin,
            route,
          });
        }
      }
    );

    axios.get('api/places').then(({data}) => {
      const graph = new Graph();
      data.forEach(place => {
        const routes = [];
        for (const key in place.links) {
          if (place.links[key].active) {
            routes.push({ [key]: Number(place.links[key].weight) });
          }
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

  setDestination = destination => {
    let route = [];
    if (this.state.origin && this.state.destination) {
      route = this.calculateRoute();
    }
    this.setState({
      destination,
      route,
    });
  }

  calculateRoute = () => {
    const { graph, origin, destination } = this.state;
    console.log('ruta calculada');
    return graph.path(origin, destination);
  }

  resetRoute = () => {
    this.setState({
      origin: null,
      destination: null,
      route: [],
      currentPlace: { beacon:{ id: ''}},
    });
  }

  render() {
    const { Current } = this.state;

    return (
      <Heading>
        <Current {...this.state.props} change={this.goToComponent} setDestination={this.setDestination} currentPlace={this.state.currentPlace} route={this.state.route} resetRoute={this.resetRoute}/>
      </Heading>
    );
  }
}

AppRegistry.registerComponent(
  'BlindconApp',
  () => BlindconApp
);
