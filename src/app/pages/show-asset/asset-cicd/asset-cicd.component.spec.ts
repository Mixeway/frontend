import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCicdComponent } from './asset-cicd.component';

describe('AssetCicdComponent', () => {
  let component: AssetCicdComponent;
  let fixture: ComponentFixture<AssetCicdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCicdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetCicdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
