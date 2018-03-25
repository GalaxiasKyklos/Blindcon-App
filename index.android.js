'use strict';

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { ListPlaces, BeaconSensor, Heading } from './Components';

const Components = {
  ListPlaces,
  BeaconSensor
};

class BlindconApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Current: Components.ListPlaces,
    };
  }

  goToListPlaces = () => {
    this.setState({
      Current: Components.ListPlaces,
    });
  }

  goToBeaconSensor = () => {
    this.setState({
      Current: Components.BeaconSensor,
    });
  }

  render() {
    const { Current } = this.state;

    return (
      <Heading>
        <Current {...this.props} change={ Current === ListPlaces ? this.goToBeaconSensor : this.goToListPlaces } />
      </Heading>
    );
  }
}

AppRegistry.registerComponent(
  'BlindconApp',
  () => BlindconApp
);
