import { Http, HttpTransportOptions } from 'winston/lib/winston/transports';
import https from 'https';
import http from 'http';
import { configure } from 'safe-stable-stringify';
import { OutgoingHttpHeader } from 'node:http';

export class CustomHttpElasticTransport extends Http {
  options: HttpTransportOptions;
  headers: NodeJS.Dict<OutgoingHttpHeader>;

  constructor(options = {}) {
    super(options);
    this.options = options;
    // Prepare options for outgoing HTTP request
    this.headers = Object.assign({}, this.options.headers) as NodeJS.Dict<OutgoingHttpHeader>;
  }

  _doRequest(options: any, callback: any, auth: any, path: any) {
    if (auth && auth.bearer) {
      this.headers.Authorization = `Bearer ${auth.bearer}`;
    }
    options['@timestamp'] = options.timestamp;
    delete options.timestamp;
    const req = (this.ssl ? https : http).request({
      ...this.options,
      method: 'POST',
      host: this.options.host,
      port: this.options.port,
      path: `/${path.replace(/^\//, '')}`,
      headers: this.headers,
      auth: (auth && auth.username && auth.password) ? (`${auth.username}:${auth.password}`) : '',
      agent: this.options.agent
    });

    req.on('error', callback);
    req.on('response', res => {
      const body: any[] = [];
      res.on('data', (chunk: any) => {
        body.push(chunk);
      })
      res.on('end', () => {
        const result = Buffer.concat(body).toString();
        console.log(result);
        callback(null, res);
      }).resume()
    });
    const jsonStringify = configure({
      ...(this.maximumDepth && { maximumDepth: this.maximumDepth })
    });
    //@ts-expect-error it should be here
    req.end(Buffer.from(jsonStringify(options, this.options.replacer), 'utf8'));
  }
}
