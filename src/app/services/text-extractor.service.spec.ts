import { TestBed } from '@angular/core/testing';

import { TextExtractorService } from './text-extractor.service';

describe('TextExtractorService', () => {
  let service: TextExtractorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextExtractorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
