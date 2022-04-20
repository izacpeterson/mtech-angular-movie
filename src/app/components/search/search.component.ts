import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  hasSearched: boolean = false;
  returnedMovies: any;
  movies: any;
  searchInput = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.discoverMovies().subscribe((data: any) => {
      this.movies = data.results;
    })
  }

  getSearch() {
    let filteredString = this.searchInput.replace(/ /g, '+').toLowerCase()
    this.apiService.searchMovies(filteredString).subscribe((data: any) => {
      console.log(data.results);
      this.returnedMovies = data.results
    })
    this.hasSearched = true
  }

}
