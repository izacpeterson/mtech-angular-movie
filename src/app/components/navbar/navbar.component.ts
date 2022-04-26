import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private userService: UserService) {}
  navName = '';
  ngOnInit(): void {
    this.userService.getUserName.subscribe((name: any) => {
      this.navName = name;
    });
  }
}
