import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SparkleSquare = () => {
    const sparkles = Array.from({ length: 10 }).map((_, index) => {
        const delay = index * 200;//each gets different delay
        const opacity = new Animated.Value(0);

        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        return { opacity };
    });

    return (
        <View style={[styles.container]}>
            {sparkles.map((sparkle, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.sparkle,
                        {
                            opacity: sparkle.opacity,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    testBorder: {
        borderColor: 'red',
        borderWidth: 3,
    },
    container: {
        //width: 150,
        //height: 150,
        height:'110%',
        width:'110%',
        //backgroundColor: '#1e1e1e',
        position: 'relative',
        //overflow: 'hidden',
        borderRadius:500,
    },
    sparkle: {
        position: 'absolute',
        width: '10%',
        aspectRatio:1,
        //height: 8,
        borderRadius: 4,
        backgroundColor: 'rgb(237, 238, 238)',
        shadowColor: 'rgb(219, 144, 249)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
});


export default SparkleSquare;