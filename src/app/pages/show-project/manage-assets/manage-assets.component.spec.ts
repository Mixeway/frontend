import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAssetsComponent } from './manage-assets.component';

describe('ManageAssetsComponent', () => {
  let component: ManageAssetsComponent;
  let fixture: ComponentFixture<ManageAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAssetsComponent ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
