import { Component } from '@angular/core';
import { FirebaseApiService } from 'src/app/services/firebase-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mtech-angular-movie';

  constructor(
    private firebase: FirebaseApiService
  ) {}

  ngOnInit() {}

}
