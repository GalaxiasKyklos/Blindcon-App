'use strict';

import React, { Component } from 'react';
import { AppRegistry, ListView } from 'react-native';
import { ListPlaces, BeaconSensor, Heading, Directions } from './Components';
import { constants, instance as axios } from './utils';

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

    this.state = {
      Current: Components[LISTPLACES],
      props: {
        places: listPlaceDs.cloneWithRows([]),
      }
    };
  }

  componentDidMount = () => {
    axios.get('api/places').then(({data}) => {
      this.setState({
        props: {
          places: this.state.props.places.cloneWithRows(data),
        }
      });
    }).catch(console.log);
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
