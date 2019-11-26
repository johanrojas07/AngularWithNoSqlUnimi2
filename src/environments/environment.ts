import * as firebase from 'firebase';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAwgddtAa88QBlsNqWGFKdEjPE0-p9hd9U",
    authDomain: "uniminuto-1edbb.firebaseapp.com",
    databaseURL: "https://uniminuto-1edbb.firebaseio.com",
    projectId: "uniminuto-1edbb",
    storageBucket: "uniminuto-1edbb.appspot.com",
    messagingSenderId: "892702806631",
    appId: "1:892702806631:web:3fbe7e7c21c5146e37bac2",
    measurementId: "G-HM65WK368G"
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
