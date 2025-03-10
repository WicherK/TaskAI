import { StyleSheet, Text, View, Animated } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useState, useEffect } from 'react';

function WaitComponent({ scaleAnim }) {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPercentage((prevPercentage) => {
                if(scaleAnim <= 0.85) setPercentage(0);

                const newPercent = prevPercentage + 25;
                if (newPercent > 100) {
                    return 0; // Reset to 0 after reaching 100
                }
                return newPercent;
            });
        }, 1500);
    
        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <Animated.View style={[styles.waitWrapper, {transform: [{ scale: scaleAnim }]}]} pointerEvents="none">
            <View style={styles.wait}>
                <Text style={styles.waitTextHeader}>Wait!</Text>
                <Text style={styles.waitTextHeader2} marginBottom={20}>AI is processing data...</Text>
                <CircularProgress
                    style={styles.progressBar}
                    value={percentage}
                    activeStrokeColor={'#2465FD'}
                    activeStrokeSecondaryColor={'#C25AFF'}
                    progressValueFontSize={0.01}
                />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    waitWrapper: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    wait: {
        width: '70%',
        paddingHorizontal: 20,
        paddingVertical: 40,
        borderRadius: 16,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
        justifyContent: 'center'
    },
    waitText: {
        color: 'white',
        fontSize: 24
    },
    waitTextHeader: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    waitTextHeader2: {
        color: 'white',
        fontSize: 18,
        marginTop: 10
    }
});

export default WaitComponent;