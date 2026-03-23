// Stub for react-native-reanimated in web builds
import React from 'react';

// Animated component that just renders children normally
const Animated = {
  View: ({ children, style, ...props }) => React.createElement('div', { style, ...props }, children),
  Text: ({ children, style, ...props }) => React.createElement('span', { style, ...props }, children),
  Image: ({ style, ...props }) => React.createElement('img', { style, ...props }),
  ScrollView: ({ children, style, ...props }) => React.createElement('div', { style, ...props }, children),
  createAnimatedComponent: (Component) => Component,
};

// Animation builders (no-op stubs)
const makeStub = () => { const s = { duration: () => s, delay: () => s, easing: () => s, springify: () => s }; return s; };
export const FadeIn = makeStub();
export const FadeOut = makeStub();
export const SlideInRight = makeStub();
export const SlideOutLeft = makeStub();
export const SlideInUp = makeStub();
export const SlideInDown = makeStub();
export const SlideOutDown = makeStub();
export const SlideOutUp = makeStub();
export const ZoomIn = makeStub();
export const ZoomOut = makeStub();
export const BounceIn = makeStub();
export const BounceOut = makeStub();
export const Layout = makeStub();
export const LinearTransition = makeStub();

// Hooks stubs
export const useSharedValue = (init) => ({ value: init });
export const useAnimatedStyle = (fn) => fn();
export const useAnimatedGestureHandler = () => ({});
export const useDerivedValue = (fn) => ({ value: fn() });
export const useAnimatedScrollHandler = () => ({});
export const useAnimatedRef = () => ({ current: null });
export const useAnimatedReaction = () => {};
export const useAnimatedProps = (fn) => fn();
export const withTiming = (val) => val;
export const withSpring = (val) => val;
export const withDelay = (_, val) => val;
export const withSequence = (...vals) => vals[vals.length - 1];
export const withRepeat = (val) => val;
export const runOnJS = (fn) => fn;
export const runOnUI = (fn) => fn;
export const cancelAnimation = () => {};
export const interpolate = (val) => val;
export const Extrapolate = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' };

export default Animated;
