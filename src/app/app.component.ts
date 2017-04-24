import { NativeStorage } from '@ionic-native/native-storage';
import { Message } from './../pages/message/message';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Logout } from './../pages/logout/logout';
import { Tour } from './../pages/tour/tour';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  @ViewChild(Nav) nav: Nav;
  pages = [
    { title: 'Itinerary', component: Tour, icon: 'list-box' },
    { title: 'Message', component: Message, icon: 'mail' },
    { title: 'Change Tour', component: Logout, icon: 'log-out' }
  ];
  constructor(public platform: Platform, 
  public statusBar: StatusBar, 
  public splashScreen: SplashScreen, 
  public push: Push,
  public nativeStorage: NativeStorage,
  public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.initPushNotification();
    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: "743312004870",
        clearBadge: true
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true",
        clearBadge: true
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log("device token ->", data.registrationId);
      this.nativeStorage.setItem('device', { deviceID: data.registrationId })
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              this.nav.push(Message);
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.nav.push(Message);
        console.log("Push notification clicked");
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}
