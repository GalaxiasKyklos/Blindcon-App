'use strict';

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import NextPage from './test';
import BeaconSensor from './BeaconSensor';

class BlindconApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Navigator {...this.props} />;
  }
}

AppRegistry.registerComponent(
  'BlindconApp',
  () => BlindconApp
);
