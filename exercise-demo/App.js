import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ExerciseScreen from './components/ExerciseScreen';
import { SimulatedSensorV2 } from './components/simulatedV2';

export default function App() {

  return (
    <View style={styles.container}>
      <SimulatedSensorV2 limits={{outerLimitTop:'55%', innerLimitTop:'52%',innerLimitBottom:'48%', outerLimitBottom:'45%'}}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
