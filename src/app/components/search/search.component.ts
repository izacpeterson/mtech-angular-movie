import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ViewportScroller } from '@angular/common';
import { map, take } from 'rxjs';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.2s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('.2s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class SearchComponent implements OnInit {
  hasResults: boolean = true;
  loading: boolean = false;
  searchInput: string = '';
  displayedMovies: any = [];
  trendingPageCount: number = 1;
  searchPageCount: number = 1;
  showScrollBtn: boolean = false;
  hasSearched: boolean = false;

  constructor(
    private apiService: ApiService,
    private scroll: ViewportScroller
  ) { }

  ngOnInit(): void {
    //gets a list of movies when the page loads
    this.loading = true;
    this.apiService.discoverMovies(this.trendingPageCount++).pipe(take(2),
      map((res: any) => {
        res.results.forEach((movie: any) => {
          this.displayedMovies.push(movie);
        })
      })
    ).subscribe()
    this.getMoreMovies();
    this.loading = false;
  }

  @HostListener('window:scroll', ['$event'])
  getScrollHeight() {
    if ((window.innerHeight + window.scrollY + 300) >= document.body.scrollHeight) {
      !this.hasSearched ? this.getMoreMovies() : this.getMoreSearches();
    }
    if (window.scrollY > 100) {
      this.showScrollBtn = true;
    }
    else {
      this.showScrollBtn = false;
    }
  }

  getSearch() {
    this.displayedMovies = [];
    this.hasSearched = true;
    this.loading = true;
    this.searchPageCount = 1;

    let filteredString = this.searchInput.replace(/ /g, '+').toLowerCase();
    this.apiService.searchMovies(filteredString, this.searchPageCount++).pipe(take(1),
      map((res: any) => {
        res.results.forEach((movie: any) => {
          this.displayedMovies.push(movie);
        })
      })
    ).subscribe()
    this.getMoreSearches();
    this.loading = false;
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  getMoreMovies() {
    this.apiService.discoverMovies(this.trendingPageCount++).pipe(take(1),
      map((res: any) => {
        res.results.forEach((movie: any) => {
          this.displayedMovies.push(movie);
        })
      })
    ).subscribe()
  }

  getMoreSearches() {
    let filteredString = this.searchInput.replace(/ /g, '+').toLowerCase();
    this.apiService.searchMovies(filteredString, this.searchPageCount++).pipe(take(1),
      map((res: any) => {
        res.results.forEach((movie: any) => {
          this.displayedMovies.push(movie);
        })
      })
    ).subscribe()
  }
}
