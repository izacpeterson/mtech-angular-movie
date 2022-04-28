import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from '../components/favorites/favorites.component';
import { LoginComponent } from '../components/login/login.component';
import { MovieDetailsComponent } from '../components/movie-details/movie-details.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { SearchComponent } from '../components/search/search.component';
import { AuthGuard } from '../shared/auth.guard';

const routes: Routes = [
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'details/:id', component: MovieDetailsComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: '', component: SearchComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
