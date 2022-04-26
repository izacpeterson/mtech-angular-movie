import { Component, HostListener, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ViewportScroller } from '@angular/common';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  hasResults: boolean = true;
  loading: boolean = false;
  searchInput: string = '';
  displayedMovies: any = [];
  pageCount: number = 1;

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
          this.displayedMovies.push(movie)
        })
        console.log('movie info', this.displayedMovies);
      })
    ).subscribe()
    this.loading = false;
  }

  @HostListener('window:scroll', ['$event'])
  getScrollHeight() {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      this.getMoreMovies()
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
          this.displayedMovies.push(movie)
        })
        console.log('movie info', this.displayedMovies);
      })
    ).subscribe()
  }

}
