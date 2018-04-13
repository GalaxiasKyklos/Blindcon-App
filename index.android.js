'use strict';

import React, { Component } from 'react';
import { AppRegistry, ListView, DeviceEventEmitter } from 'react-native';
import { ListPlaces, Heading, Directions } from './Components';
import Beacons from 'react-native-beacons-manager';
import { constants, instance as axios } from './utils';
import Graph from 'node-dijkstra';

const { LISTPLACES, DIRECTIONS } = constants;

const Components = {
  [LISTPLACES]: ListPlaces,
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
      placesList: [],
      origin: null,
      destination: null,
      graph,
      props: {
        places: listPlaceDs.cloneWithRows([]),
        change: this.goToComponent,
        setDestination: this.setDestination,
        resetRoute: this.resetRoute,
        currentPlace: { beacon:{ id: ''}},
        route: [],
      },
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
        let { route } = this.state.props;
        const { placesList, origin, destination, props } = this.state;
        const currentBeacon =  data.beacons[0];
        const place = placesList.find(p => p.beacon.id.toLowerCase() === currentBeacon.uuid.toLowerCase());

        if (origin && destination && route.length === 0) {
          route = this.calculateRoute(origin, destination);
        }

        if (currentBeacon.uuid.toLowerCase() !== props.currentPlace.beacon.id.toLowerCase() || route.length > 0){
          this.setState({
            props: { ...props, route, currentPlace: place ? place : { beacon: { id: ''}} },
            origin: origin && route.length !== 0 ? origin : place ? place.place : origin,
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
    const { origin, props } = this.state;
    if (origin) {
      route = this.calculateRoute(origin, destination);
    }
    this.setState({
      destination,
      props: { ...props, route },
    });
  }

  calculateRoute = (origin, destination) => {
    const { graph } = this.state;
    console.log('ruta calculada');
    return graph.path(origin, destination);
  }

  resetRoute = () => {
    this.setState({
      origin: null,
      destination: null,
      props: {
        ...this.state.props,
        route: [],
        currentPlace: { beacon:{ id: ''}},
      }
    });
  }

  render() {
    const { Current, props } = this.state;

    return (
      <Heading>
        <Current {...props}/>
      </Heading>
    );
  }
}

AppRegistry.registerComponent(
  'BlindconApp',
  () => BlindconApp
);
