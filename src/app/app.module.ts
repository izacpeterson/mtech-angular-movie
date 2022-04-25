import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './modules/material.module';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DragScrollModule } from 'ngx-drag-scroll';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SearchComponent,
    MovieDetailsComponent,
    FavoritesComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    DragScrollModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
