import { Message } from './../pages/message/message';
import { LocationDetail } from './../pages/location-detail/location-detail';
import { Nlbr } from './../pipes/nlbr';
import { ArrayFilter } from './../pipes/array-filter';
import { Logout } from './../pages/logout/logout';
import { Tour } from './../pages/tour/tour';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NativeStorage } from '@ionic-native/native-storage';
import { Push } from '@ionic-native/push';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { Ng2OrderModule } from 'ng2-order-pipe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Tour,
    Logout,
    ArrayFilter,
    Nlbr,
    LocationDetail,
    Message
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'push',
      platforms: {
        ios: {
          menuType: 'overlay',
        }
      }
    }),
    HttpModule,
    Ng2OrderModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Tour,
    Logout,
    LocationDetail,
    Message
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    NativeStorage,
    Push,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
