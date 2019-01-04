import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {User} from "../shared/models/User";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: User;

  constructor( private location: Location) {
    this.user = new User();

  }



  ngOnInit() {


  }

}
