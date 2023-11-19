import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class WebClientRTCService {
  private socket!: Socket;
  private localPeerConnection!: RTCPeerConnection;
  private dataChannel: RTCDataChannel | null = null;
  private userId!: string;
  private remoteUserId!: string;

  // Observable to emit received messages through the data channel
  public onMessage: Subject<any> = new Subject();

  constructor() {
    // Create the local RTC connection
    this.localPeerConnection = new RTCPeerConnection();
    // Configure ICE candidates handling
    this.handleICE();
  }

  // Initialize connection with the server and set up event handlers
  async openSocket(userId: string): Promise<void> {
    this.userId = userId;
    // Connect to the Socket.io server
    this.socket = io('http://localhost:3000', { withCredentials: true, query: { userId: this.userId } });

    // Handle RTC answer from the other peer
    this.socket.on('answer', (answer) => {
      console.log('Answer received');
      this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // Handle RTC offer from the other peer
    this.socket.on('offer', async (data) => {
      console.log('Offer received');
      console.log(data);
      this.remoteUserId = data.userId;
      await this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await this.localPeerConnection.createAnswer();
      await this.localPeerConnection.setLocalDescription(answer);
      this.socket.emit('answer', { answer, targetUserId: data.userId });
    });

    // Handle ICE candidates from the other peer
    this.socket.on('ice-candidate', (candidate) => {
      console.log('ICE received');
      this.localPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });


    // Set up the data channel when received from the other peer
    this.localPeerConnection.ondatachannel = (event) => {
      console.log('Data channel received');
      this.dataChannel = event.channel;
      this.setupDataChannel();
    };
  }

  // Configure ICE candidates handling
  handleICE(): void {
    console.log('Preparing ICE');
    this.localPeerConnection.onicecandidate = ({ candidate }) => {
      console.log('Sending ICE');
      if (candidate) {
        this.socket.emit('ice-candidate', { candidate: candidate.toJSON(), targetUserId: this.remoteUserId });
      }
    };
  }

  // Create an RTC offer and send it to the other peer
  async createOffer(remoteUserId: string): Promise<void> {
    this.remoteUserId = remoteUserId;
    console.log('Sending offer');
    try {
      // Create the data channel
      this.dataChannel = this.localPeerConnection.createDataChannel('myDataChannel');
      this.setupDataChannel();

      // Create and send the RTC offer
      const offer = await this.localPeerConnection.createOffer();
      await this.localPeerConnection.setLocalDescription(offer);
      this.socket.emit('offer', { offer, targetUserId: this.remoteUserId });
    } catch (error) {
      console.error('Error creating the offer:', error);
    }
  }




  // Set up event handlers for the data channel
  setupDataChannel(): void {
    if (!this.dataChannel) {
      console.error('Data channel is not defined');
      return;
    }

    this.dataChannel.onopen = () => console.log('Data channel open');
    this.dataChannel.onmessage = (event) => {
      console.log('Message received:', event.data);
      this.onMessage.next(JSON.parse(event.data));
    };
    this.dataChannel.onclose = () => console.log('Data channel closed');
  }

  // Send a message through the data channel
  sendMessage(text: string): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      const message = JSON.stringify({ text });
      this.dataChannel.send(message);
      console.log('Message sent');
    } else {
      console.error('Data channel is not open');
    }
  }
}
