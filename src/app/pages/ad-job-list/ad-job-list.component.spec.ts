import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdJobListComponent } from './ad-job-list.component';

describe('AdJobListComponent', () => {
  let component: AdJobListComponent;
  let fixture: ComponentFixture<AdJobListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdJobListComponent]
    });
    fixture = TestBed.createComponent(AdJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
