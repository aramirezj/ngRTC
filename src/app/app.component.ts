import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WebRTCService } from './web-rtc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngRTC';

  public webRTC:WebRTCService = inject(WebRTCService);

  websocketopen: boolean = false;
  RTCopen: boolean = false;

  controlId = new FormControl();

  control = new FormControl();
  controlTargetId = new FormControl()

  async openRTC(){
    await this.webRTC.createOffer();
    this.RTCopen = true;
  }

  async openWebSocket(){
    await this.webRTC.openSocket(this.controlId.value);
    this.websocketopen = true;
  }

  sendMessage(){
    this.webRTC.sendMessage(this.control.value, this.controlTargetId.value);
    this.websocketopen = true;
  }
}
