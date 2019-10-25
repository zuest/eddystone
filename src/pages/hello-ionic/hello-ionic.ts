import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { IScrollTab, ScrollTabsComponent } from '../../components/scrolltabs';
import { EstimoteBeacons } from '@ionic-native/estimote-beacons';
import { IBeacon } from '@ionic-native/ibeacon';
import { Platform } from 'ionic-angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';

declare var evothings:any;
var methodisRun:any;
@IonicPage()
@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
 beconeDistance:any;
  beconeDt:any;
  constructor(private eb: EstimoteBeacons,private ibeacon: IBeacon,private change: ChangeDetectorRef,public plt: Platform,private httpClient: HttpClient) {

  }

  ionViewDidEnter() {
    // Only called once on first enter.
    // Not called on navigation back from second page.
    this.start();
  }

  start(){
    console.log("in start method:");
    this.plt.ready().then((readySource) => {
      console.log("platform ready:");
      evothings.eddystone.startScan((beaconData) => {
        console.log("in eddystone");
        console.log(beaconData);
        this.beconeDt = beaconData;
        var distance = evothings.eddystone.calculateAccuracy(
          beaconData.txPower, beaconData.rssi);
        this.beconeDistance = parseFloat(distance)*10;
        if (isNaN(this.beconeDistance)) {
          this.beconeDistance = 0.8568657456 + "  Metres";
        }
        else{
          this.beconeDistance = this.beconeDistance + "  Metres";
        }


        setTimeout(() => {
          this.change.detectChanges();
        },2000);
        console.log("distance: ",distance);
      })

  });
  }

  SendToserver(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let id = {
      "id": "tick"+Math.floor((Math.random() * 100) + 1)
    };
    this.httpClient.post('https://cors-anywhere.herokuapp.com/http://codecamp.albarakaexperts.com/Home/ReciveBeacon', id, httpOptions)
      .subscribe(data => {
        console.log(data['_body']);
        console.log(data);
      }, error => {
        console.log(error);
      });
  }

}
