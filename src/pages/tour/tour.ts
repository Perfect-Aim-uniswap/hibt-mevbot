import { LocationDetail } from './../location-detail/location-detail';
import { HomePage } from './../home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the Tour page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html'
})
export class Tour {
  tour = {
    Package: {
      PackageName: ''
    }
  };
  day = 1;
  dayList: any = [];
  itineraries: Array<{ Sequence: number}>;
  language = 'EN';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public nativeStorage: NativeStorage,
    public modalCtrl: ModalController) {
    platform.ready().then(() => {
      this.nativeStorage.getItem('hib')
        .then(
        (data) => {
          if (data == null) {
            this.navCtrl.push(HomePage);
          } else {
            this.tour = data.tour;

            this.language = data.tour.Package.TourLanguageCode;
            this.itineraries = data.tour.Package.Itineraries;

            let allDay = data.tour.Package.DayTour;
            let startDay = data.tour.TravelFrom;
            let date = new Date(startDay + 'Z');
            for (let i = 0; i < allDay; i++) {
              this.dayList.push({
                name: 'Day ' + (i + 1).toString() + ' - ' + this.formatDate(date),
                value: i + 1
              });
              date.setDate(date.getDate() + 1);
            }
          }
        },
        error => {
          alert(error);
          this.navCtrl.popToRoot();
        });
    });
  }

  formatDate(date) {
    let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    return day + ' ' + monthNames[monthIndex];
  }
  findLocation(locationDetails) {
    for (let i = 0; i < locationDetails.length; i++) {
      if (locationDetails[i].LanguageCode === this.language) {
        return locationDetails[i];
      }
    }
  }

  getFirstImageFile(imageFile) {
    if (imageFile == null || imageFile == undefined || imageFile == '') {
      return '';
    } else {
      return 'http://b.hib.life/images/locations/' + imageFile.split('|')[0];
    }
  }

  openLocation(location) {
    let locationModal = this.modalCtrl.create(LocationDetail, { location: location, language: this.language });
    locationModal.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Tour');
  }

}
