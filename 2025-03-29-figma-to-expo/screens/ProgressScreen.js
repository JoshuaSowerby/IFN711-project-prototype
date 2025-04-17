import React from 'react';
import { View, Text,  StyleSheet } from 'react-native';
import common from '../styles/common';

const ProgressScreen = ({ navigation }) => {
  return (
    <View style={common.container}>
        {/*query SQLite for things*/}
        <Text>Todo</Text>
    </View>
  );
};

export default ProgressScreen;