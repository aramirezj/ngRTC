import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

@Injectable({providedIn: 'root'})
export class WebRTCService {

  private socket!: Socket;
  private localPeerConnection!: RTCPeerConnection;
  private dataChannel: RTCDataChannel | null = null;
  private userId!: string;

  /**
   * We open the socket connection with the back sending our ID. Also the ICE is prepared
   * @param userId User Id
   */
  async openSocket(userId: string): Promise<void> {
    this.userId = userId;
    this.socket = io('http://localhost:3000', { withCredentials: true, query: { userId: this.userId } });
    this.localPeerConnection = new RTCPeerConnection();

    this.socket.on('answer', (answer) => {
      console.log('Answer recibida');
      console.log(answer);
      this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.handleICE();
  }

  /** The ice events and sending is prepared for when the RTC is open*/
  handleICE(): void {
    console.log('Preparo ICE');
    this.socket.on('ice-candidate', (candidate) => {
      console.log('ICE recibido');
      this.localPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.localPeerConnection.onicecandidate = ({ candidate }) => {
      console.log('Mando ICE');
      console.log(candidate);
      if (candidate) {
        this.socket.emit('ice-candidate', { candidate: candidate.toJSON(), userId: this.userId });
      }
    };


    this.localPeerConnection.ondatachannel = (event) => {
      console.log('Canal de datos recibido');
      this.dataChannel = event.channel;
      this.setupDataChannel();
    };
  }

  /** An offer is sent to the back to create the RTC. At the same time, we prepare a data channel and register the events */
  async createOffer(): Promise<void> {
    console.log('Mandamos oferta');
    try {
      // Crear un canal de datos
      this.dataChannel = this.localPeerConnection.createDataChannel('myDataChannel');
      this.setupDataChannel();

      const offer = await this.localPeerConnection.createOffer();
      await this.localPeerConnection.setLocalDescription(offer);
      this.socket.emit('offer', offer);
    } catch (error) {
      console.error('Error al crear la oferta:', error);
    }
  }


  /** Registration of events of the channel */
  setupDataChannel(): void {
    if (!this.dataChannel) {
      console.error('Data channel no está definido');
      return;
    }

    this.dataChannel.onopen = () => console.log('Data channel abierto');
    this.dataChannel.onmessage = (event) => console.log('Mensaje recibido:', JSON.parse(event.data));
    this.dataChannel.onclose = () => console.log('Data channel cerrado');
  }


  /**
   * Function to send a message from the client's channel to other client's channel using the RTC connection with the server.
   * @param rawText Text to send
   * @param targetId target userId to send
   */
  sendMessage(rawText: string, targetId: string): void {
    console.log(this)
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      const text: string = `From ${this.userId} I say ${rawText}`;
      const message = JSON.stringify({ targetId, text, userId: this.userId });
      this.dataChannel.send(message);
      console.log('sent')
    } else {
      console.error('Data channel no está abierto');
    }
  }
}


