import { Vibration, } from 'react-native';

const withVibration = (func = () => {}, time = 100) => {
  return (...args) => {
    Vibration.vibrate(time);
    func(...args);
  };
};

export {
  withVibration,
};
