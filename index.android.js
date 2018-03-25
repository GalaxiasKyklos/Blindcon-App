'use strict';

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import NextPage from './Components/test';
import BeaconSensor from './Components/BeaconSensor';
import Heading from './Components/Heading';

const Components = {
  NextPage,
  BeaconSensor
};

class BlindconApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Current: Components.BeaconSensor
    };
  }

  goToNext = () => {
    this.setState({
      Current: Components.NextPage
    });
  }

  goToBeaconSensor = () => {
    this.setState({
      Current: Components.BeaconSensor
    });
  }

  render() {
    const { Current } = this.state;

    return (
      <Heading>
        <Current {...this.props} change={ Current === NextPage ? this.goToBeaconSensor : this.goToNext } />
      </Heading>
    );
  }
}

AppRegistry.registerComponent(
  'BlindconApp',
  () => BlindconApp
);
