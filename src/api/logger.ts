import { createLogger, format } from "winston";
import { AxiosTransport } from 'winston-fetch-axios';

let dateString = new Date(new Date()).toISOString().split("T")[0];
dateString = dateString.replaceAll("-", ".");

export const log = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.sss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "inventory-api" },
  transports: [
    // //
    // // - Write all logs with importance level of `error` or higher to `error.log`
    // //   (i.e., error, fatal, but not other levels)
    // //
    // new transports.File({ filename: "logs/error.jsonl", level: "error" }),
    // //
    // // - Write all logs with importance level of `info` or higher to `combined.log`
    // //   (i.e., fatal, error, warn, and info, but not trace)
    // //
    // new transports.File({ filename: "logs/root.jsonl" }),

    // new transports.Console({ format: format.colorize({all: true}) }),

    // new AxiosHttpElasticTransport({
    //   ssl: true,
    //   host: 'kolenka-inc-4135333449.eu-central-1.bonsaisearch.net',
    //   port: 443,
    //   auth: {
    //     username: 'NX4jPVtxmC',
    //     password: 'QNw5bzyHoXC9YFkr',
    //   },
    //   path: `filebeat-7.10.2-${dateString}/_doc/`,
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    // }),
    new AxiosTransport({
      url: 'https://kolenka-inc-4135333449.eu-central-1.bonsaisearch.net:443',
      path: `filebeat-7.10.2-${dateString}/_doc/`,
      auth: 'Tlg0alBWdHhtQzpRTnc1Ynp5SG9YQzlZRmty',
      authType: 'basic'
    }),
  ],
});
