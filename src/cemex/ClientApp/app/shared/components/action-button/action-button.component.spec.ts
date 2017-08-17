import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/http.api.service';

import { ActionButtonComponent } from './action-button.component';

describe('ActionButtonComponent', () => {
  let component: ActionButtonComponent;
  let fixture: ComponentFixture<ActionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionButtonComponent ],
      imports: [ HttpModule ],
      providers: [
        {
          provide: ApiService,
          useFactory: ApiService.createService,
          deps: [
            XHRBackend,
            RequestOptions,
          ],
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
