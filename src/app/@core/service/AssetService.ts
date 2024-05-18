import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {ProjectUser} from '../Model/ProjectUser';
import {ProjectAsset} from '../Model/ProjectAsset';
import {Scan} from '../Model/Scan';
import {VulnTrendChart} from '../Model/VulnTrendChart';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  showProjectPath: string = '/show/project';
  constructor(private http: HttpClient) { }

  errorHandl(error) {
    if (error.status === 403) {
      const expires = 'expires=' + new Date().toUTCString();
      document.cookie = `role=;Path=/;expires=${expires}`;
      window.location.reload();
    }
    return throwError(error.status);
  }
  saveAsset(id, form) {
    return this.http.post<ProjectUser[]>('/v3/api/asset/create/project/' + id , form)
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  getAssets(id) {
    return this.http.get<ProjectAsset[]>('/v3/api/asset/project/' + id )
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  editAsset(id, form) {
    return this.http.post<ProjectUser[]>('/v3/api/asset/' + id + '/edit' , form)
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
  getScansForAsset(id, type) {
    return this.http.get<Scan[]>('/v3/api/asset/' + id + '/' + type + '/scans'  )
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }

  getVulnTrendChart(id, type): Observable<VulnTrendChart> {
    return this.http.get<VulnTrendChart>('/v3/api/asset/' + id + '/' + type +
      '/trend')
      .pipe(
        retry(1),
        catchError(this.errorHandl),
      );
  }
}
