import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import Controller from 'react-native-huecontrollr';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    Controller.createWithAutoIpAndUsername('test', 'test2', (_) => {
      console.log('callback');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
