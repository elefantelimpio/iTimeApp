import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { GeolocationService } from './geolocation.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class TimeTrackingService implements OnDestroy {
  public isWorking$: Subject<any>;
  public currentWorkingTime$: Subject<any>;

  constructor(private httpClient: HttpClient,
    private geolocationService: GeolocationService) {
    this.isWorking$ = new Subject();
    this.currentWorkingTime$ = new Subject();
  }

  public send(): void {
    const email = localStorage.getItem('email');
    const date: Date = new Date(Date.now());

    this.geolocationService.getCurrentPosition()
      .pipe(
        switchMap(location => {
          const body = { email, date, position: { longitude: location.coords.longitude, latitude: location.coords.latitude } };
          return this.httpClient.post(`${environment.api_url}/timeTracking`, body);
        })
      )
      .subscribe((response) => {
        this.isWorking$.next(response['isWorking']);
      }, (error) => {
        this.isWorking$.next(false);
        console.log('TimeTrackingService send', error);
      });
  }

  public getIsWorking(): void {
    const email = localStorage.getItem('email');
    const date: Date = new Date(Date.now());
    this.httpClient.post(`${environment.api_url}/timeTracking/isWorking`, { email, date })
      .subscribe((response) => {
        this.isWorking$.next(response['isWorking']);
      }, (error) => {
        this.isWorking$.next(false);
        console.log('TimeTrackingService getIsWorking', error);
      });
  }

  public getTodayTimeTrackingList(): Observable<any> {
    const email = localStorage.getItem('email');
    return this.httpClient.post(`${environment.api_url}/timeTracking/todayTrackingsByPairs`, { email });
    // .subscribe((response) => {
    //   this.currentWorkingTime$.next(response);
    // }, (error) => {
    //   this.currentWorkingTime$.next(null);
    //   console.log('currentWorkingTime getIsWorking', error);
    // });
  }

  public getTimeTrackingList(): Observable<any> {
    const email = localStorage.getItem('email');
    return this.httpClient.get(`${environment.api_url}/timeTracking`);
  }




  ngOnDestroy(): void {
    this.isWorking$.next(null);
    this.isWorking$.complete();

    this.currentWorkingTime$.next(null);
    this.currentWorkingTime$.complete();
  }
}
