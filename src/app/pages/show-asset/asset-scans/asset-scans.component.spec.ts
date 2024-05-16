import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetScansComponent } from './asset-scans.component';

describe('AssetScansComponent', () => {
  let component: AssetScansComponent;
  let fixture: ComponentFixture<AssetScansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetScansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetScansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
