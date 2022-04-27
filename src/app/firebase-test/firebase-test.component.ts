import { Component, OnInit } from '@angular/core';
import { FirebaseApiService } from 'src/app/services/firebase-api.service';

@Component({
  selector: 'app-firebase-test',
  templateUrl: './firebase-test.component.html',
  styleUrls: ['./firebase-test.component.scss']
})
export class FirebaseTestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
