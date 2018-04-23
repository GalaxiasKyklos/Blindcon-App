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
      log: [],
      graph,
      props: {
        places: listPlaceDs.cloneWithRows([]),
        change: this.goToComponent,
        setDestination: this.setDestination,
        resetRoute: this.resetRoute,
        currentPlace: { beacon:{ id: ''}},
        route: [],
        sendLog: this.sendLog,
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
          let toLog;
          if (currentBeacon.uuid.toLowerCase() !== props.currentPlace.beacon.id.toLowerCase()) {
            if (['near', 'immediate'].some(a => a === data.beacons[0].proximity)) {
              toLog = {
                place,
                time: Date.now(),
              };
            }
          }

          this.setState({
            props: { ...props, route, currentPlace: place ? place : { beacon: { id: ''}} },
            origin: origin && route.length !== 0 ? origin : place ? place.place : origin,
            log: toLog ? [...this.state.log, toLog] : this.state.log
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
    return graph.path(origin, destination);
  }

  sendLog = (partialRoute = true) => {
    if (this.state.log.length !== 0) {
      const data = {
        destination: this.state.destination,
        origin: this.state.origin,
        partialRoute,
        places: this.state.log,
      };
      axios.post('api/log', data).then().catch(console.error);
      this.setState({
        log: [],
      });
    }
  }

  resetRoute = () => {
    this.sendLog();
    this.setState({
      origin: null,
      destination: null,
      log: [],
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
