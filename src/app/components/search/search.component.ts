import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  hasResults: boolean = true;
  searchInput: string = '';
  displayedMovies: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    //gets a list of movies when the page loads
    this.apiService.discoverMovies().subscribe((data: any) => {
      this.displayedMovies = data.results;
    })
  }

  getSearch() {
    //filters the search query
    let filteredString = this.searchInput.replace(/ /g, '+').toLowerCase()
    //makes API call
    this.apiService.searchMovies(filteredString).subscribe((data: any) => {
      //if there are results assign to returnedMovies
      if (data.total_results > 1) {
        this.displayedMovies = data.results;
        this.hasResults = true;
      }
      else {
        //if there are no results will display a message
        this.hasResults = false;
      }
    })
  }

}
