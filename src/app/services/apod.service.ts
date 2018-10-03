import { Injectable } from '@angular/core';

import { Observable, pipe, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class ApodService {

  private nasaAPODCollection: AngularFirestoreCollection<any>;

  constructor(private http: HttpClient, public firestore: AngularFirestore) {
    this.nasaAPODCollection = this.firestore.collection(`/nasaAPOD`);
    //dbInit writes mass API feed to DB
    // this.dbInit();
  }

  getAPODImageList(): AngularFirestoreCollection<any> {
    return this.nasaAPODCollection;
  }

  fetchData(): Observable<any>  {
    
    let today = new Date();

    const startMonth = (today.getMonth()+1)< 10 ? `0${today.getMonth()}`: `${today.getMonth()+1}`
    const endMonth = (today.getMonth()+1)< 9 ? `${today.getMonth()-1}`: `0${today.getMonth()}`

    const date = (today.getMonth())< 10 ? `0${today.getDate()}`: `${today.getDate()+1}`

    const startDate = `${today.getFullYear()}-${endMonth}-${date}`
    const endDate = `${today.getFullYear()}-${startMonth}-${date}`

        //Build the URL that will be used to access the API based on the users current preferences
        let url = `https://api.nasa.gov/planetary/apod?api_key=fFEwdwhLfz16mNz2Fz3a2Q1NPKqrRWNqEqiznEl1&start_date=${startDate}&end_date=${endDate}`;

        //Make a Http request to the URL and subscribe to the response
        return this.http.get(url)

    }

  
  dbInit(): void {
    this.fetchData().subscribe( data => {

      data.forEach(image => {
        if(image.media_type != "video"){
          this.addImage(image);
        }
      });
      
    })
  }

  async addImage(image): Promise<any> {

  const newImageREf: firebase.firestore.DocumentReference = await this.nasaAPODCollection.add({});

  return newImageREf.update({
      id: newImageREf.id,
      count: 0,
      date: image.date,
      explanation: image.explanation,
      hdurl: image.hdurl,
      media_type: image.media_type,
      service_version: image.service_version,
      title: image.title,
      url: image.url
    })

  }

  addLike(id): void {

    this.nasaAPODCollection.doc(id).ref.get()
    .then( 
      doc => {        
          this.nasaAPODCollection.doc(id).update({
            count:  doc.data().count += 1
        }) 
      }
    )
 
  
  }
}
