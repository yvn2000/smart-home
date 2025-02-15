import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, /*Animated,*/ Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, withSpring, withSequence, Easing } from 'react-native-reanimated';



const { width, height } = Dimensions.get("window");

const dist = (width + 0.2*width)  //pixels
console.log("distance: " + dist)

const speed = 300 //pixels per second
console.log("speed: " + speed)

const time = dist/speed
console.log("time in secs: " + time)

const timeMS = time*1000
console.log("time in millisecs: " + timeMS)

const r = 0.3*width;    //Revolution radius from center or revolve



const LavaLampBackground = () => {

  const circle1Progress = useSharedValue(0);
  const circle2Progress = useSharedValue(0);
  const circle3Progress = useSharedValue(0);
  const circle4Progress = useSharedValue(0);

  const cats1 = useSharedValue(0);
  const cats1Delay1 = useSharedValue(0);
  const cats1Delay2 = useSharedValue(0);

  const animatedCircle1 = useAnimatedStyle(() => {
    
    /*
    const rotation = Math.sin(circle1Progress.value * 2 * Math.PI) * 90;
    
    return {
      transform: [
        { rotate: `${rotation}deg` }, // Rotation
      ],
    }*/


      const radius1 = r; // Distance from center
      const angle1 = circle1Progress.value * 2 * Math.PI; // Convert progress to radians
      const x1 = Math.cos(angle1) * radius1; // Calculate x position
      const y1 = Math.sin(angle1) * radius1; // Calculate y position
  
      return {
        transform: [
          { translateX: x1 }, // Move horizontally
          { translateY: y1 }, // Move vertically
        ],
      };


  });

  const animatedCircle2 = useAnimatedStyle(() => {

      const radius2 = r; // Distance from center
      const angle2 = circle2Progress.value * 2 * Math.PI; // Convert progress to radians
      const x2 = Math.cos(angle2) * radius2; // Calculate x position
      const y2 = Math.sin(angle2) * radius2; // Calculate y position
  
      return {
        transform: [
          { translateX: x2 }, // Move horizontally
          { translateY: y2 }, // Move vertically
        ],
      };

  });

  const animatedCircle3 = useAnimatedStyle(() => {

    const radius3 = r; // Distance from center
    const angle3 = circle3Progress.value * 2 * Math.PI; // Convert progress to radians
    const x3 = Math.cos(angle3) * radius3; // Calculate x position
    const y3 = Math.sin(angle3) * radius3; // Calculate y position

    return {
      transform: [
        { translateX: x3 }, // Move horizontally
        { translateY: y3 }, // Move vertically
      ],
    };

  });

  const animatedCircle4 = useAnimatedStyle(() => {

    const radius4 = r; // Distance from center
    const angle4 = circle4Progress.value * 2 * Math.PI; // Convert progress to radians
    const x4 = Math.cos(angle4) * radius4; // Calculate x position
    const y4 = Math.sin(angle4) * radius4; // Calculate y position

    return {
      transform: [
        { translateX: x4 }, // Move horizontally
        { translateY: y4 }, // Move vertically
      ],
    };

  });


  const animatedCat = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: cats1.value}
      ]
    }
  });

  const animatedCatDelay1 = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: cats1Delay1.value}
      ]
    }
  });

  const animatedCatDelay2 = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: cats1Delay2.value}
      ]
    }
  });


  useEffect(() => {

    circle1Progress.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.linear }), // Full arc in 1 second
      -1, // Infinite repetition
      false   //go back
    ),
    circle2Progress.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.linear }), // Full arc in 1 second
      -1, // Infinite repetition
      false   //go back
    ),
    circle3Progress.value = withRepeat(
      withTiming(1, { duration: 7500, easing: Easing.linear }), // Full arc in 1 second
      -1, // Infinite repetition
      false   //go back
    ),
    circle4Progress.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.linear }), // Full arc in 1 second
      -1, // Infinite repetition
      false   //go back
    ),

    cats1.value = withRepeat(
      withTiming(-dist, {
        duration: timeMS, // Adjust for how fast the image slides
        easing: Easing.linear,
      }),
      -1,
      false
    ),

    cats1Delay1.value = withDelay(timeMS/3, withRepeat(
      withTiming(-dist, {
        duration: timeMS, // Adjust for how fast the image slides
        easing: Easing.linear,
      }),
      -1,
      false
      )
    ),

    cats1Delay2.value = withDelay((timeMS/3)*2, withRepeat(
      withTiming(-dist, {
        duration: timeMS, // Adjust for how fast the image slides
        easing: Easing.linear,
      }),
      -1,
      false
      )
    )

  }, []);





  return (
    //<View style={{height:'100%', width:'100%'}}>
      <View style={[styles.container, {height:'100%'}]}>

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, animatedCat]} 
          />

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, animatedCatDelay1]} 
          />

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, animatedCatDelay2]} 
          />

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, {top:'5%'}, animatedCat]} 
          />

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, {top:'5%'}, animatedCatDelay1]} 
          />

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, {top:'5%'}, animatedCatDelay2]} 
          />

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, {bottom:'5%'}, animatedCat]} 
          />

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, {bottom:'5%'}, animatedCatDelay1]} 
          />

          <Animated.Image
            source={require('../../assets/CatAssets/Cat1/Head/completecathead1.png')} 
            style={[styles.catHead, {bottom:'5%'}, animatedCatDelay2]} 
          />

        <Animated.View style={[{
          width:'35%', 
          //bottom:'55%',
          aspectRatio: 1,
          borderRadius:1000, position:'absolute', 
          backgroundColor:'rgba(235, 0, 200, 0.6)',
          
        }, animatedCircle1]} />  

        <Animated.View style={[{
          width:'40%', 
          //left:'55%',
          aspectRatio: 1,
          borderRadius:1000, position:'absolute', 
          backgroundColor:'rgba(246, 41, 215, 0.74)',
          
        },  animatedCircle2]} />  

        <Animated.View style={[{
          width:'20%', 
          //right:'55%',
          aspectRatio: 1,
          borderRadius:1000, position:'absolute', 
          backgroundColor:'rgba(211, 46, 186, 0.79)',
          
        }, animatedCircle3]} />  

        <Animated.View style={[{
          width:'30%', 
          //top:'55%',
          aspectRatio: 1,
          borderRadius:1000, position:'absolute', 
          backgroundColor:'rgba(216, 83, 196, 0.6)'
        }, animatedCircle4]} />


      </View>

  )


}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // Vertically center
    alignItems: 'center', // Horizontally center
    backgroundColor: 'rgb(202, 1, 179)', // Light background color
    height: '100%',
    //height: 1000,
    //width: '100%',
  },
  circle: {
    width: 150,  // Circle width
    height: 150, // Circle height
    borderRadius: 75,  // Make it circular
    backgroundColor: 'rgba(235, 0, 200, 0.6)', // last number is transparency between 0 and 1
    position:'absolute',
  },
  catHead: {
    position:'absolute',
    width:'20%',
    height:'30%',
    right: '-20%',
  },

})

export default LavaLampBackground;




