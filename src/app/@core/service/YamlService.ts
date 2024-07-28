// yaml.service.ts
import { Injectable } from '@angular/core';
import * as yaml from 'js-yaml';

@Injectable({
  providedIn: 'root',
})
export class YamlService {

  constructor() { }

  convertObjectToYaml(obj: any): string {
    return yaml.dump(obj);
  }
}
