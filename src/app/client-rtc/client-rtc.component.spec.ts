import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRTCComponent } from './client-rtc.component';

describe('ClientRTCComponent', () => {
  let component: ClientRTCComponent;
  let fixture: ComponentFixture<ClientRTCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientRTCComponent]
    });
    fixture = TestBed.createComponent(ClientRTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
