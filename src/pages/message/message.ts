import { Http } from '@angular/http';
import { HomePage } from './../home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';

/**
 * Generated class for the Message page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class Message {
  messages: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController,
    public http: Http,
    public alertCtrl: AlertController) {
      platform.ready().then(() => {
        this.update();
    });
  }
  update() {
    this.nativeStorage.getItem('hib')
        .then(
        (data) => {
          if (data == null) {
            this.navCtrl.setRoot(HomePage);
          } else {
            this.updateTour(data.tour.TourCode)
          }
        },
        error => {
          alert(error);
          this.navCtrl.popToRoot();
        });
  }
  updateTour(tourCode) {
    let url = 'http://www.hib.life/API/api/Tour/' + tourCode;
    let loader = this.loadingCtrl.create({ content: 'Please wait...' });
    loader.present();
    this.http.get(url)
      .map(res => res.json()) 
      .subscribe(data => {
        loader.dismiss();
        //console.log(data);
        if (data === null) {
          this.errorAlert('Not found this tour!!');
        } else {
          this.nativeStorage.setItem('hib', { tour: data })
              .then(
                () => {
                  this.messages = data.Messages;
                  for (let i =  0; i < this.messages.length; i++) {
                    this.messages[i].SendDT = new Date(this.messages[i].SentDateTime + 'Z');
                  }
                },
                error => { this.errorAlert('Error storing item'); }
              );
        }
      },
      (error) => {
        loader.dismiss();
        this.errorAlert('Internet connection error');
      });
  }

  errorAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Message');
  }

}
