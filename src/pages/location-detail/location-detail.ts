import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the LocationDetail page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html',
})
export class LocationDetail {
  location = {
    name: '',
    detail: '',
    images: [],
    latitude: '',
    longitude: ''
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
    let locationSelect = this.navParams.get('location');
    let language = this.navParams.get('language');
    let detail = this.findLocation(locationSelect.Details, language);
    this.location.name = detail.LocationName;
    this.location.detail = detail.Description;
    this.location.latitude = locationSelect.Latitude;
    this.location.longitude = locationSelect.Longitude;
    this.location.images = locationSelect.ImageFiles === '' ? [] : locationSelect.ImageFiles.split('|');

  }
  findLocation(locationDetails, language) {
    for (let i = 0; i < locationDetails.length; i++) {
      if (locationDetails[i].LanguageCode === language) {
        return locationDetails[i];
      }
    }
  }
  dismiss() {
    this.navCtrl.pop();
  }
  openMap() {
    if (this.platform.is('ios')) {
      var geoString = 'maps://?q=' + this.location.latitude + ',' + this.location.longitude + '';
      window.open(geoString, '_system');
    } else {
      window.location.href = 'geo:' + this.location.latitude + ',' + this.location.longitude;
    }
    //window.open('https://www.google.com/maps/@' + this.location.latitude + ',' + this.location.longitude + ',18z');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationDetail');
  }

}
