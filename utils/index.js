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
  baseURL: 'https://ab8457b0.ngrok.io',
});

export {
  withVibration,
  constants,
  instance,
};
