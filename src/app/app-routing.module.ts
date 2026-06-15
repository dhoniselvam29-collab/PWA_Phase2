import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GameAccessGuard } from './guards/game-access-guard';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'reception-room',  canActivate: [ AuthGuard, GameAccessGuard],
    loadChildren: () => import('./rooms/reception-room/reception-room.module').then( m => m.ReceptionRoomPageModule)
  },
  {
    path: 'hr-room',  canActivate: [ AuthGuard, GameAccessGuard],
    loadChildren: () => import('./rooms/hr-room/hr-room.module').then( m => m.HrRoomPageModule)
  },
  {
    path: 'office-bay',  canActivate: [ AuthGuard, GameAccessGuard],
    loadChildren: () => import('./rooms/office-bay/office-bay.module').then( m => m.OfficeBayPageModule)
  },
  {
    path: 'start-screen',  canActivate: [AuthGuard],
    loadChildren: () => import('./start-screen/start-screen.module').then( m => m.StartScreenPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
    
  },{
    path: 'leaderboardlist',
    loadChildren: () => import('./leaderboardlist/leaderboardlist.module').then( m => m.LeaderboardlistPageModule)
  },
  {
    path: 'gameoverscreen',   canActivate: [AuthGuard, GameAccessGuard],
    loadChildren: () => import('./common-components/gameoverscreen/gameoverscreen.module').then( m => m.GameoverscreenPageModule)
  },
  {
    path: 'success-screen',
    loadChildren: () => import('./pages/success-screen/success-screen.module').then( m => m.SuccessScreenPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
