import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ViewportScroller } from '@angular/common';
import { map, take } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  pageCount: number = 1;
  showScrollBtn: boolean = false;

  constructor(
    private apiService: ApiService,
    private scroll: ViewportScroller
  ) { }

  ngOnInit(): void {
    //gets a list of movies when the page loads
    this.loading = true;
    this.apiService.discoverMovies(this.pageCount++).pipe(
      map((res: any) => {
        res.results.forEach((movie: any) => {
          this.displayedMovies.push(movie);
        })
      })
    ).subscribe()
    this.loading = false;
  }

  @HostListener('window:scroll', ['$event'])
  getScrollHeight() {
    if ((window.innerHeight + window.scrollY + 250) >= document.body.scrollHeight) {
      this.getMoreMovies();
    }
    if (window.scrollY > 100) {
      this.showScrollBtn = true
    }
    else {
      this.showScrollBtn = false
    }

  }

  getSearch() {
    this.loading = true;
    //filters the search query
    let filteredString = this.searchInput.replace(/ /g, '+').toLowerCase();
    //makes API call
    this.apiService.searchMovies(filteredString).subscribe((data: any) => {
      //if there are results assign to returnedMovies
      if (data.total_results > 1) {
        this.displayedMovies = data.results;
        this.hasResults = true;
        this.loading = false;
      }
      else {
        //if there are no results will display a message
        this.hasResults = false;
        this.loading = false;
      }
    })
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  getMoreMovies() {
    this.apiService.discoverMovies(this.pageCount++).pipe(take(1),
      map((res: any) => {
        res.results.forEach((movie: any) => {
          this.displayedMovies.push(movie);
        })
      })
    ).subscribe()
  }

}
