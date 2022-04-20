import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  hasSearched: boolean = false;
  hasResults: boolean = true;
  returnedMovies: any;
  movies: any;
  searchInput = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    //gets a list of movies when the page loads
    this.apiService.discoverMovies().subscribe((data: any) => {
      this.movies = data.results;
    })
  }

  getSearch() {
    //filters the search query
    let filteredString = this.searchInput.replace(/ /g, '+').toLowerCase()
    this.apiService.searchMovies(filteredString).subscribe((data: any) => {
      //if there are results assign to returnedMovies
      if (data.total_results > 1) {
        this.returnedMovies = data.results;
        this.hasResults = true;
      }
      else {
        //if there are no results will display a message
        this.hasResults = false;
      }
    })
    this.hasSearched = true;
  }

}
