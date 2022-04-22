import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  hasResults: boolean = true;
  loading: boolean = false;
  searchInput: string = '';
  displayedMovies: any;

  constructor(
    private apiService: ApiService,
    private scroll: ViewportScroller
  ) { }

  ngOnInit(): void {
    //gets a list of movies when the page loads
    this.loading = true;
    this.apiService.discoverMovies().subscribe((data: any) => {
      this.displayedMovies = data.results;
    })
    this.loading = false;
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

}
