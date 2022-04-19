import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from '../components/favorites/favorites.component';
import { LoginComponent } from '../components/login/login.component';
import { MovieDetailsComponent } from '../components/movie-details/movie-details.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { SearchComponent } from '../components/search/search.component';

const routes: Routes = [
  { path: 'favorites', component: FavoritesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'details/:id', component: MovieDetailsComponent },
  { path: 'search', component: SearchComponent },
  { path: '', component: LoginComponent },
  { path: '**', pathMatch: 'full', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
