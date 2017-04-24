import { NativeStorage } from '@ionic-native/native-storage';
import { Tour } from './../tour/tour';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tourCode;
  statusText;
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public barcodeScanner: BarcodeScanner,
    public http: Http,
    public nativeStorage: NativeStorage,
    public platform: Platform) {
      platform.ready().then(() => {
        this.nativeStorage.getItem('hib')
          .then(
          (data) => {
            if (data != null) {
              this.navCtrl.push(Tour);
            }
          },
          error => {});
      });
  }

  scanQR() {
    let cameraOption = {
        showTorchButton : true, // iOS and Android
        prompt : "Place a barcode inside the scan area", // Android
        formats : "QR_CODE"
    };
    this.barcodeScanner.scan(cameraOption).then((barcodeData) => {
      let barcodeText = barcodeData.text;
      let hibUrl = 'http://www.hib.life/?C=';
      if (barcodeText.indexOf(hibUrl) >= 0) {
        this.tourCode = barcodeText.substring(hibUrl.length);
        this.getTour();
      } else {
        this.statusText = 'Incorrect QR Code!!';
        this.tourCode = '';
      }
    }, (err) => {
        this.statusText = 'Cannot scan code [Please check your camera permission]';
    });
  }

  getTour() {

    // Use http property to send get Request
    let url = 'http://www.hib.life/API/api/Tour/' + this.tourCode;

    let loader = this.loadingCtrl.create({ content: 'Please wait...' });
    loader.present();
    this.http.get(url)
      .map(res => res.json()) 
      .subscribe(data => {
        loader.dismiss();
        //console.log(data);
        if (data === null) {
          this.statusText = 'Not found this tour!!';
        } else {
          this.nativeStorage.getItem('device').then(
            device => {
              this.pushRegister(device.deviceID, this.tourCode);
              this.nativeStorage.setItem('hib', { tour: data })
              .then(
                () => { this.navCtrl.push(Tour); },
                error => { this.statusText =  'Error storing item'; }
              );
            }
          );
        }
      },
      (error) => {
        loader.dismiss();
        this.statusText = 'Internet connection error';
      });
  }

  pushRegister(deviceID, tourCode) {
    let obj = {
      tourCode: tourCode,
      isGuide: false,
      deviceID: deviceID,
      deviceType: this.platform.is('ios') ? 'ios' : 'android'
    }
    let url = 'http://www.hib.life/API/api/Push';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post(url, JSON.stringify(obj), { headers: headers})
      .map(res => res.json()) 
      .subscribe(data => {
      });
  }
}
