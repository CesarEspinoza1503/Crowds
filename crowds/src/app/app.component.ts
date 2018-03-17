import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';


  const firebaseConfig = {
    apiKey: "AIzaSyDkxu8W0cHoB9RDv6icPPW4VhiH0KaNXnY",
    authDomain: "crowds-46fa8.firebaseapp.com",
    databaseURL: "https://crowds-46fa8.firebaseio.com",
    projectId: "crowds-46fa8",
    storageBucket: "crowds-46fa8.appspot.com",
    messagingSenderId: "391193300639"
  };



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

