import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";


import { StatusBar } from "expo-status-bar";
import {
  Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
  TouchableOpacity, Image, RefreshControl

} from "react-native";

import { useEffect, useState, useRef } from "react";

import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, withSpring, withSequence, Easing } from 'react-native-reanimated';


export default function Pet({ moodStates, imageDisplays }) {

  const navigation = useNavigation()

  useEffect(() => {

  }, [moodStates, imageDisplays])

  /*
  const [moodStates, setMood] = useState({
    happy: true,
    sad: false,
    death: false,
    joy: false,
  });

  const [imageDisplays, setImageDisplays] = useState({
    bg1: true,
    bg2: false,
    bg3: false,
    hat0: true,
    hat1: false,
    hat2: false,
  });

  const [prevBG, setPrevBG] = useState('bg1')
  const [prevHat, setPrevHat] = useState('hat0')

  const changeSetting = (newBG, newHat) => {
    setImageDisplays((prevDisplays) => ({
        ...prevDisplays,
        [prevBG]: !prevDisplays[prevBG],
        [prevHat]: !prevDisplays[prevHat],
        [newBG]: true,
        [newHat]: true,
    }));

    setPrevBG(newBG);
    setPrevHat(newHat)

  }

  const [prevMood, setPrevMood] = useState('happy')

  const changeMood = (newMood) => {
    setMood((prevMoods) => ({
      ...prevMoods,
      [prevMood]: !prevMoods[prevMood],
      [newMood]: true,
    }));

    setPrevMood(newMood)
  }
  */




  // Shared values for animations
  const headAnimationProgress = useSharedValue(0);
  const tailAnimationProgress = useSharedValue(0);
  const headAnimationDeath = useSharedValue(0);
  const tailAnimationDeath = useSharedValue(0);
  const gunAnimationProgress = useSharedValue(0);
  const muzzleAnimationProgress = useSharedValue(0);
  const mouthAnimationProgress = useSharedValue(0);
  const eyesAnimationProgress = useSharedValue(1);

  const redProg = useSharedValue(0);


  const animatedHeadStyle = useAnimatedStyle(() => {
    const angle = headAnimationProgress.value * Math.PI; // Convert progress to radians (0 to π)
    //const rotation = headAnimationProgress.value * -30; // Convert progress to degrees (0 to 360)
    const rotationHappy = Math.sin(headAnimationProgress.value * 2 * Math.PI) * 10; // Oscillates between -10° and +10°
    const rotationSad = Math.sin(headAnimationProgress.value * 2 * Math.PI) * 1;
    const rotationDeath = Math.sin(headAnimationDeath.value * 2 * Math.PI) * 1.5;

    if (moodStates.happy || moodStates.joy) {
      return {
        transform: [
          //{ translateX: 10 * Math.cos(angle) }, // Horizontal arc
          //{ translateY: -5 * Math.sin(angle) }, // Vertical arc (upside down)

          { rotate: `${rotationHappy}deg` }, // Rotation
        ],
      };
    }
    else if (moodStates.sad) {
      return {
        transform: [
          { rotate: `${rotationSad}deg` }, // Rotation
        ],
      };

    }

    else if (moodStates.death) {
      return {
        transform: [
          { rotate: `${rotationDeath}deg` }, // Rotation
        ],
      };

    }

  });

  const animatedTailStyle = useAnimatedStyle(() => {
    const rotationHappy = Math.sin(tailAnimationProgress.value * 2 * Math.PI) * 5; // Oscillates between -5° and +5°
    const rotationSad = Math.sin(tailAnimationProgress.value * 2 * Math.PI) * 1.5;
    const rotationDeath = Math.sin(tailAnimationDeath.value * 2 * Math.PI) * 1.5;
    const rotationJoy = Math.sin(tailAnimationProgress.value * 2 * Math.PI) * 10;
    if (moodStates.happy) {
      return {
        transform: [
          //{ translateY: 10 * Math.sin(angle) }, // Vertical sinusoidal motion\
          { rotate: `${rotationHappy}deg` }, // Rotation
        ],
      };
    }

    else if (moodStates.sad) {
      return {
        transform: [
          { rotate: `${rotationSad}deg` }, // Rotation
        ],
      };
    }

    else if (moodStates.death) {
      return {
        transform: [
          { rotate: `${rotationDeath}deg` }, // Rotation
        ],
      };
    }

    else if (moodStates.joy) {
      return {
        transform: [
          { rotate: `${rotationJoy}deg` }, // Rotation
        ],
      };
    }


    /*
    return {
        transform: [
            //{ translateY: 10 * Math.sin(angle) }, // Vertical sinusoidal motion\
            { rotate: `${rotation}deg` }, // Rotation
        ],
    };*/
  });

  const animatedGun = useAnimatedStyle(() => {

    const rotation = Math.sin(gunAnimationProgress.value * 1) * 185;

    if (moodStates.death) {
      return {
        display: 'flex',
        transform: [
          { rotate: `${rotation}deg` }, // Rotation
        ],
      };
    }
    else {
      return {
        display: 'none',
      };
    }
  });

  const animatedMuzzle = useAnimatedStyle(() => {

    const opacity = muzzleAnimationProgress.value

    return {
      opacity: opacity, // Animate opacity
    };

  });

  const animatedMeow = useAnimatedStyle(() => {

    const opacity = mouthAnimationProgress.value

    return {
      opacity: opacity,
    };
  });

  const animatedEyes = useAnimatedStyle(() => {

    const opacity = eyesAnimationProgress.value
    const rotationHappy = Math.sin(headAnimationProgress.value * 2 * Math.PI) * 10; // Oscillates between -10° and +10°

    if (moodStates.happy) {
      return {
        opacity: opacity,
      };
    }
    else if (moodStates.joy) {
      return {
        transform: [{ scale: opacity }, { rotate: `${rotationHappy}deg` }],
      };
    }
    return {
      opacity: opacity,
    };
  });










  //Common across all mood states
  useEffect(() => {


    //Head movement animation
    headAnimationProgress.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.linear }), // Full arc in 1 second
      -1, // Infinite repetition
      false   //go back
    ),

      // Tail movement animation
      tailAnimationProgress.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.linear }), // Faster animation for the tail
        -1, // Infinite repetition
        false
      )


    headAnimationDeath.value = withRepeat(
      withTiming(1, { duration: 100, easing: Easing.linear }), // Full arc in 1 second
      -1, // Infinite repetition
      false
    ),

      tailAnimationDeath.value = withRepeat(
        withTiming(1, { duration: 100, easing: Easing.linear }), // Faster animation for the tail
        -1, // Infinite repetition
        false
      )


    /*
    // Gun draw animation
    gunAnimationProgress.value = withDelay(
      2000,
      withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        1, // Infinite repetition
        false
      )
    )

    //Muzzle animation
    muzzleAnimationProgress.value = withDelay(
      2000,
      withRepeat(
        withTiming(1, { duration: 3000 }),
        -1, // Infinite repetition
        false
      )
    )
    */


  }, []);


  //Specifically for happy & joyful animations that require if else
  useEffect(() => {

    if (moodStates.happy) {


      eyesAnimationProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 5000 }),
          withSpring(0, { damping: 100, stiffness: 1000 }),
          withTiming(0, { duration: 2000 }),
        ),
        -1, // Infinite repetition
        false
      )

      mouthAnimationProgress.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 5000 }),
          //closeEyes(true),
          withSpring(1, { damping: 100, stiffness: 1000 }), // Instant jump to 1
          //-1, // Infinite repetition
          //false
          withTiming(1, { duration: 2000 }),
          //closeEyes(false),
          //-1, // Infinite repetition
          //false
        ),
        -1, // Infinite repetition
        false
      )

    }

    else if (moodStates.joy) {

      eyesAnimationProgress.value = withRepeat(
        withTiming(1.05, { duration: 300, easing: Easing.inOut(Easing.ease) }), // Scale up to 1.5
        -1, // Infinite repetition
        true
      )

      mouthAnimationProgress.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 5000 }),
          withSpring(1, { damping: 100, stiffness: 1000 }), // Instant jump to 1
          withTiming(1, { duration: 2000 }),
        ),
        -1, // Infinite repetition
        false
      )


    }

    else {
      eyesAnimationProgress.value = 1;
      mouthAnimationProgress.value = 0;
    }

  }, [moodStates.happy, moodStates.joy])


  //Specifically for death animations that require if else
  useEffect(() => {

    if (moodStates.death) {

      // Gun draw animation
      gunAnimationProgress.value = withDelay(
        500,
        withRepeat(
          withTiming(1, { duration: 2000/*, easing: Easing.linear*/ }),
          1, // Infinite repetition
          false
        )
      )

      muzzleAnimationProgress.value = withDelay(
        2500,
        withRepeat(
          withTiming(1, { duration: 200/*, easing: Easing.linear*/ }),
          1, // Infinite repetition
          false
        )
      )

      
      redProg.value = withDelay(
        2800,
        withRepeat(
          withTiming(1, { duration: 0/*, easing: Easing.linear*/ }),
          1, // Infinite repetition
          false
        )
      )
      
    }
    else {
      gunAnimationProgress.value = 0;
      muzzleAnimationProgress.value = 0;
      redProg.value = 0;

    }

  }, [moodStates.death])





  return (



    <View style={[{ padding: 10, justifyContent: 'center', alignItems: 'center', }]}>

      <View style={[styles.container, styles.shadow]}>

        {/* Background 1 */}
        {imageDisplays.bg1 && (<Image style={styles.bgImage} source={require('../assets/CatAssets/Backgrounds/bg1.png')} />)}

        {/* Background 2 */}
        {imageDisplays.bg2 && (<Image style={styles.bgImage} source={require('../assets/CatAssets/Backgrounds/bg2.png')} />)}

        {/* Background 3 */}
        {imageDisplays.bg3 && (<Image style={styles.bgImage} source={require('../assets/CatAssets/Backgrounds/bg3.png')} />)}

        <Image source={require('../assets/CatAssets/Cat1/Body/Bodies/catbody1.png')} style={{ position: 'absolute', display: 'none' }} />

        {/* Cat body */}
        <View style={[styles.catBodyOuter]}>

          {/* Happy Tail */}
          {(moodStates.happy || moodStates.joy) && (<Animated.Image source={require('../assets/CatAssets/Cat1/Body/Tails/cattail1.png')} style={[styles.catBody, animatedTailStyle]} />)}

          {/* Sad Tail */}
          {moodStates.sad && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Body/Tails/cattail1sad.png')}
            style={[styles.catBody, animatedTailStyle]}
          />)}

          {/* Death Tail */}
          {moodStates.death && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Body/Tails/cattail1death.png')}
            style={[styles.catBody, animatedTailStyle]}
          />)}

          {/* Base body */}
          <Image source={require('../assets/CatAssets/Cat1/Body/Bodies/catbody1.png')} style={[styles.catBody]} />

          {/* Paw */}
          <Image source={require('../assets/CatAssets/Cat1/Body/Paws/catpaw1.png')} style={styles.catBody} />

        </View>

        {/* Cat head */}
        <View style={[styles.catHead, animatedHeadStyle]}>

          {/* Cat head */}
          <Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/completecathead1.png')}
            style={[styles.catFace, animatedHeadStyle, { display: 'none' }]}
          />

          {/* Cat Face */}
          <Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Faces/cathead1.png')}
            //source={require('../assets/CatAssets/Cat1/Head/completecathead1.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />

          {/* Cat Right Eye */}
          {((moodStates.happy || moodStates.sad)) && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/Right/catrighteye1.png')}
            style={[styles.catFace, animatedHeadStyle, animatedEyes]}
          />)}


          {/* Cat Left Eye */}
          {((moodStates.happy || moodStates.sad)) && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/Left/catlefteye1.png')}
            style={[styles.catFace, animatedHeadStyle, animatedEyes]}
          />)}

          {/* Cat Right Eye Closed */}
          {(moodStates.happy) && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/Right/catrighteyeclosed.png')}
            style={[styles.catFace, animatedHeadStyle, animatedMeow]}
          />)}


          {/* Cat Left Eye Closed */}
          {(moodStates.happy) && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/Left/catlefteyeclosed.png')}
            style={[styles.catFace, animatedHeadStyle, animatedMeow]}
          />)}

          {/* Cat Right Eye Death */}
          {moodStates.death && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/Right/rightdeath.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}


          {/* Cat Left Eye Death*/}
          {moodStates.death && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/Left/leftdeath.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}

          {/* Cat Right Eye Heart */}
          {moodStates.joy && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/Right/catrighteyeheart.png')}
            style={[styles.catFace, animatedHeadStyle, animatedEyes]}
          />)}


          {/* Cat Left Eye Heart*/}
          {moodStates.joy && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/Left/catlefteyeheart.png')}
            style={[styles.catFace, animatedHeadStyle, animatedEyes]}
          />)}

          {/* Sad Eyebrows*/}
          {(moodStates.sad || moodStates.death) && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/sadeyebrows.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}


          {/* Cat Mouth 1 */}
          {(moodStates.happy || moodStates.joy) && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Mouths/catmouth1.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}

          {/* Cat Mouth 2 */}
          {(moodStates.happy || moodStates.joy) && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Mouths/catmouth2.png')}
            style={[styles.catFace, animatedHeadStyle, animatedMeow]}
          />)}

          {/* Cat Mouth 3 */}
          {moodStates.sad && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Mouths/catmouth3.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}

          {/* Cat Mouth 4 */}
          {moodStates.death && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Mouths/catmouth4.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}


          {/* Hat 1 */}
          {imageDisplays.hat1 && !imageDisplays.hat0 && (<Animated.Image
            source={require('../assets/CatAssets/Hats/newhat1.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}

          {/* Hat 2 */}
          {imageDisplays.hat2 && !imageDisplays.hat0 && (<Animated.Image
            source={require('../assets/CatAssets/Hats/newhat2.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}


          {/* Tears */}
          {(moodStates.sad || moodStates.death) && (<Animated.Image
            source={require('../assets/CatAssets/Cat1/Head/Eyes/tears.png')}
            style={[styles.catFace, animatedHeadStyle]}
          />)}




        </View>

        {/* Muzzle Flash */}
        {moodStates.death && (<Animated.Image style={[styles.muzzle, animatedMuzzle]} source={require('../assets/CatAssets/Gun/muzzleflash1.png')} />)}

        {/* Gun */}
        {moodStates.death && (<Image style={[styles.gun, { display: 'none' }]} source={require('../assets/CatAssets/Gun/revolver1.png')} />)}

        {/* Gun Flipped */}
        {moodStates.death && (<Animated.Image style={[styles.gun, animatedGun]} source={require('../assets/CatAssets/Gun/revolverflipped2.png')} />)}

        {/* Red Screen */}
        {moodStates.death && (<Animated.Image style={[styles.redScreen, { display: redProg.value==1 ? 'flex' : 'none' }]} source={require('../assets/CatAssets/Gun/redscreen.png')} />)}
      </View>

    </View>


  );

}



const styles = StyleSheet.create({
  petDisplay: {
    padding: 10,
    height: 350,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
  },
  buttons1: {
    height: 80,
    width: 100,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#c5c5c5',
    marginHorizontal: 10,
  },
  buttons2: {
    padding: 2,
    height: 90,
    width: 90,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#c5c5c5',
    marginHorizontal: 10,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    //flex: 1,
    //width:1080,
    width: '100%',
    aspectRatio: 1, // Maintain aspect ratio
    maxWidth: 1080,
    maxHeight: 1080,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'rgba(119, 92, 255, 0.9)',
    overflow: 'hidden',
    resizeMode: 'contain', // Maintain aspect ratio
  },
  catBodyOuter: {
    //width: 1000,
    //bottom: -180,
    //width: '92.6%',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  catBody: {
    bottom: '-21%',
    width: '100%',
    height: '100%',
    position: 'absolute',


  },
  catHead: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  catFace: {
    //width: 600,
    //height: 600,
    bottom: '7%',
    left: '27%',
    width: '70%',
    height: '70%',
    position: 'absolute',
  },
  gun: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    right: '-56%',
    bottom: '-70%',
  },
  muzzle: {
    position: 'absolute',
    width: '55%',
    height: '55%',
    right: '20%',
    bottom: '21%',
    transform: [{ rotate: '30deg' }],
    //display: 'none',
  },
  redScreen: {
    position: 'absolute',
  },
  shadow: {
    //shadow
    shadowColor: '#7F5Df0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
