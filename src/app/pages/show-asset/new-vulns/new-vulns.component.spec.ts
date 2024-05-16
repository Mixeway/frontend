import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVulnsComponent } from './new-vulns.component';

describe('NewVulnsComponent', () => {
  let component: NewVulnsComponent;
  let fixture: ComponentFixture<NewVulnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewVulnsComponent ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewVulnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
