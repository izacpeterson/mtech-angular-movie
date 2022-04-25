import { TestBed } from '@angular/core/testing';

import { Api.FirebaseService } from './api.firebase.service';

describe('Api.FirebaseService', () => {
  let service: Api.FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Api.FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
