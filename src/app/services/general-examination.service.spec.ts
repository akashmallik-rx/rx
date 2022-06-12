import { TestBed } from '@angular/core/testing';

import { GeneralExaminationService } from './general-examination.service';

describe('ExaminationService', () => {
  let service: GeneralExaminationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralExaminationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
