import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, '.') },
        { find: 'react-native-reanimated', replacement: path.resolve(__dirname, 'src/mocks/react-native-reanimated.js') },
        { find: 'react-native-web/Libraries/Utilities/codegenNativeComponent', replacement: 'react-native-web/dist/modules/UnimplementedView' },
        // Must come last: catches all react-native/* sub-path imports
        { find: /^react-native($|\/.*)/, replacement: path.resolve(__dirname, 'src/mocks/react-native.js') },
      ],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
