import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { gameAccessGuard } from './game-access-guard';

describe('gameAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => gameAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
