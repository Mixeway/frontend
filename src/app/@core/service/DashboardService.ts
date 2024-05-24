import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AllVulnTrendData } from '../Model/AllVulnTrendData';
import { environment } from '../../../environments/environment';
import {AllSourceDataChart} from '../Model/AllSourceDataChart';
import {Project} from '../Model/Project';
import {SessionOwner} from '../Model/SessionOwner';
// @ts-ignore
import {SearchResponse} from '../Model/SearchResponse';
import {DashboardTopStatistics} from '../Model/DashboardTopStatistics';
import {DashboardStat} from '../Model/DashboardStat';
import {Metric} from '../Model/Metric';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {


  constructor(private http: HttpClient) {
  }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // GET
  search(search): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(environment.backend + '/dashboard/search', search, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  stats(): Observable<DashboardStat> {
    return this.http.get<DashboardStat>(environment.backend + '/dashboard/stat')
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  getSessionOwner(): Observable<SessionOwner> {
    return this.http.get<SessionOwner>(environment.backend + '/dashboard/userinfo')
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  getTrendData(): Observable<AllVulnTrendData[]> {
    return this.http.get<AllVulnTrendData[]>(environment.backend + '/dashboard/getvulntrenddata')
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  getSourceTrendData(): Observable<AllSourceDataChart> {
    return this.http.get<AllSourceDataChart>(environment.backend + '/dashboard/getsourcetrenddata')
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(environment.backend + '/dashboard/projects')
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  getRootStatistics(): Observable<DashboardTopStatistics> {
    return this.http.get<DashboardTopStatistics>(environment.backend + '/dashboard/statistics')
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  deleteProject(id): Observable<null> {
    return this.http.delete<null>(environment.backend + '/dashboard/projects/' + id)
      .pipe(
        retry(1),
        catchError(this.showErrorOnDelete),
      );
  }
  addProject(name, description, ciid, enableVulnManage): Observable<null> {
    return this.http.put<null>(environment.backend + '/dashboard/projects/' + name + '/' + description + '/'
      + ciid + '/' + enableVulnManage, null)
      .pipe(
        retry(1),
        catchError(this.showErrorOnDelete),
      );
  }
  editProject(id, project): Observable<null> {
    return this.http.patch<null>(environment.backend + '/dashboard/projects/' + id, project)
      .pipe(
        retry(1),
        catchError(this.showErrorOnDelete),
      );
  }
  moergeProjects(source, destination) {
    return this.http.get<null>(environment.backend + '/dashboard/merge/project/source/'
      + source + '/destination/' + destination)
      .pipe(
        retry(1),
        catchError(this.showErrorOnDelete),
      );
  }

  getMetric():  Observable<Metric> {
    return this.http.get<Metric>('/v3/api/dashboard/metric')
      .pipe(
        retry(1),
        catchError(this.showErrorOnDelete),
      );
  }
  getProjectMetric(id: number):  Observable<Metric> {
    return this.http.get<Metric>('/v3/api/dashboard/project/' + id + '/metric')
      .pipe(
        retry(1),
        catchError(this.showErrorOnDelete),
      );
  }
  showErrorOnDelete() {
    return throwError(null);
  }
  errorHandl(error) {
    if (error.status === 403) {
      const expires = 'expires=' + new Date().toUTCString();
      document.cookie = `role=;Path=/;expires=${expires}`;
      window.location.reload();
    }
    return throwError(error.status);
  }
}
