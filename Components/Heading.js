import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import NavigationBar from 'react-native-navbar';

class Heading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleConfig: {
        title: 'Blindcon',
      }
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.state.titleConfig}
        />
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Heading;
