import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  movies: any;
  searchInput = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getTrendingMovies().subscribe((data: any) => {
      this.movies = data.results;
    })
  }

  getSearch() {
    console.log(this.searchInput);
  }

}
