import { Vibration, } from 'react-native';
import axios from 'axios';

const withVibration = (func = () => {}, time = 100) =>
  (...args) => {
    Vibration.vibrate(time);
    func(...args);
  };
const constants = {
  BEACONSENSOR: 'BeaconSensor',
  DIRECTIONS: 'Directions',
  HEADING: 'Heading',
  LISTPLACES: 'ListPlaces',
};

const instance = axios.create({
  baseURL: 'ec2-18-222-35-78.us-east-2.compute.amazonaws.com',
});

export {
  withVibration,
  constants,
  instance,
};
