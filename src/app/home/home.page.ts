import { Component, OnInit } from '@angular/core';

import { ApodService } from '../services/apod.service';
import { AuthService } from '../services/auth.service';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  public apodImageList: Observable<any>;

  constructor(private apodService: ApodService, private authService: AuthService) {
    //this.authService.logoutUser()
  }

  ngOnInit(){
    this.apodImageList = this.apodService.getAPODImageList().valueChanges(); 
  }


  addLike(id){
    this.apodService.addLike(id);
  }


}
