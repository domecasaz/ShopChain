import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchNetworkComponent } from './switch-network.component';

describe('SwitchNetworkComponent', () => {
  let component: SwitchNetworkComponent;
  let fixture: ComponentFixture<SwitchNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
