import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { GameService } from '../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class GameAccessGuard implements CanActivate {

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

 async canActivate(
  route: ActivatedRouteSnapshot
): Promise<boolean | UrlTree> {

  const gameStarted =
    localStorage.getItem('gameStarted');

  if (!gameStarted) {

    return this.router.parseUrl(
      '/start-screen'
    );
  }

  const data =
    await this.gameService.loadGame();

  if (!data) {

    return this.router.parseUrl(
      '/start-screen'
    );
  }

  const targetUrl =
    route.routeConfig?.path;

  const currentRoom =
    data.currentRoom;

  const routeMap: any = {
    'reception-room': 'reception-room',
    'office-bay': 'bay-area',
    'hr-room': 'hr-room',
    'gameoverscreen': 'gameoverscreen'
  };

  if (routeMap[targetUrl!] === currentRoom) {
    return true;
  }

  const redirectRoute =
    Object.keys(routeMap).find(
      key => routeMap[key] === currentRoom
    ) || 'start-screen';

  return this.router.parseUrl(
    '/' + redirectRoute
  );
}
}