import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WebClientRTCService } from '../web-client-rtc.service';

@Component({
  selector: 'app-client-rtc',
  templateUrl: './client-rtc.component.html',
  styleUrls: ['./client-rtc.component.scss']
})
export class ClientRTCComponent {
  public webRTC:WebClientRTCService = inject(WebClientRTCService);

  websocketopen: boolean = false;
  RTCopen: boolean = false;

  controlId = new FormControl('Alejandro');

  control = new FormControl('Holitas');
  controlTargetId = new FormControl('Peter')

  messagesReceived:string[] = []

  changeDetectorRef:ChangeDetectorRef = inject(ChangeDetectorRef)

  async openWebSocket(){
    await this.webRTC.openSocket(this.controlId.value as string);
    this.websocketopen = true;
    this.webRTC.onMessage.subscribe(event => {
      this.messagesReceived.push(event.text);
      this.changeDetectorRef.detectChanges();
    })
  }

  async openRTC(){
    await this.webRTC.createOffer(this.controlTargetId.value as string);
    this.RTCopen = true;
  }



  sendMessage(){
    this.webRTC.sendMessage(this.control.value as string);
    this.websocketopen = true;
  }
}
