import { Http, HttpTransportOptions } from 'winston/lib/winston/transports';
import axios, { AxiosInstance, AxiosHeaders } from 'axios';
import { configure } from 'safe-stable-stringify';

export class AxiosHttpElasticTransport extends Http {
  options: HttpTransportOptions;
  headers: AxiosHeaders;
  axiosClient: AxiosInstance;

  constructor(options: HttpTransportOptions = {}) {
    super(options);
    this.options = options;

    // Safely map headers to Axios-compatible format
    this.headers = new AxiosHeaders();
    const rawHeaders = Object.entries(this.options.headers || {});
    rawHeaders.reduce((acc, [k, v]) => {
      acc[k] = v?.toString();
      return acc;
    }, this.headers);
    this.axiosClient = axios.create({
      adapter: 'fetch'
    });
  }

  _doRequest(
    payload: any,
    callback: (err: Error | null, res?: any) => void,
    auth: any,
    path: string
  ) {
    console.log('_doRequest inside custom logger');

    if (auth) {
      if (auth.bearer) {
        this.headers['Authorization'] = `Bearer ${auth.bearer}`;
      }

      if (auth.username && auth.password) {
        const base64Code = Buffer.from(`${auth.username}:${auth.password}`).toString('base64')
        this.headers['Authorization'] = `Basic ${base64Code}`;
      }
    }

    const requestData = {
      ...payload,
      ['@timestamp']: payload.timestamp
    };
    delete requestData.timestamp;

    const jsonStringify = configure({
      ...(this.maximumDepth && { maximumDepth: this.maximumDepth })
    });

    const url = `${this.ssl ? 'https' : 'http'}://${this.options.host}:${this.options.port}/${path.replace(/^\//, '')}`;
    const data = jsonStringify(requestData, this.options.replacer)
    const settings = {
      headers: {
        'Content-Type': 'application/json',
        ...this.headers
      },
      auth:
        auth?.username && auth?.password
          ? {
              username: auth.username,
              password: auth.password
            }
          : undefined
    }
    console.log('Im going to push logs to elasticsearch')
    console.log(url);
    console.log(data);
    console.log(settings);

    this.axiosClient.post(url, data, settings)
          .then((response: any) => {
            console.log('response was:');
            console.log(response);
            callback(null, response)
          })
          .catch((error: any) => callback(error));
  }
}
