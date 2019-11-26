import * as firebase from 'firebase';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAYYgSPkCKIOob99dMm8kcMVSAnXiT6Rv8',
    authDomain: 'uniminuto-3-corte.firebaseapp.com',
    databaseURL: "https://uniminuto-3-corte.firebaseio.com",
    projectId: "uniminuto-3-corte",
    storageBucket: "uniminuto-3-corte.appspot.com",
    messagingSenderId: "43805400436",
    appId: "1:43805400436:web:624059bb314cfcd56ee021",
    measurementId: "G-BXSM6L197D"
  }
  // Initialize Firebase
};
firebase.initializeApp(environment.firebaseConfig);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
