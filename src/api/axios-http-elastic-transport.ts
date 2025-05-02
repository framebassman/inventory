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

  async _doRequest(
    payload: any,
    callback: (err: Error | null, res?: any) => void,
    auth: any,
    path: string
  ) {
    console.log('_doRequest inside custom logger');

    if (auth?.bearer) {
      this.headers['Authorization'] = `Bearer ${auth.bearer}`;
    }

    const requestData = {
      ...payload,
      ['@timestamp']: payload.timestamp
    };
    delete requestData.timestamp;

    const jsonStringify = configure({
      ...(this.maximumDepth && { maximumDepth: this.maximumDepth })
    });

    try {
      const response = await this.axiosClient.post(
        `${this.ssl ? 'https' : 'http'}://${this.options.host}:${
          this.options.port
        }/${path.replace(/^\//, '')}`,
        jsonStringify(requestData, this.options.replacer),
        {
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
      );

      callback(null, response);
    } catch (error) {
      callback(error as Error);
    }
  }
}
