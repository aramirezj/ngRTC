import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerRTCComponent } from './server-rtc.component';

describe('ServerRTCComponent', () => {
  let component: ServerRTCComponent;
  let fixture: ComponentFixture<ServerRTCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServerRTCComponent]
    });
    fixture = TestBed.createComponent(ServerRTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
