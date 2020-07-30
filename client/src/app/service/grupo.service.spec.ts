import { TestBed } from '@angular/core/testing';

import { GrupoService } from './grupo.service';

describe('GrupoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrupoService = TestBed.get(GrupoService);
    expect(service).toBeTruthy();
  });
});
