import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Controller from './screens/Controller';

const App = () => {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Controller />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2E3532',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;
