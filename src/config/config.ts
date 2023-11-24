/**
 * This file exports default configurations across test, development and
 * production environments. If you wish to modify configuration, please use
 * environment variables or the .env file
 *
 * Nota Bene
 *
 * Whereas previously (<10.1), config.js served as an editable configuration
 * file, post 10.1, configuration should be set via environment variables
 * or the `.env` file - with environment variables taking precedence
 */

// Load .env into environment variables

import { config as dotenv } from "dotenv";
dotenv();

import { join } from "path";
import { defaults } from "./defaults";

const defaultEnv = process.env.NODE_ENV || "development";

export type Env = "development" | "test" | "production";

interface PostgresConfig {
  connectionString: string;
  ssl?: any;
}

interface LogConfig {
  name: string;
  file: string;
}

export interface Config {
  googleAnalyticsKey: string;
  postgres: PostgresConfig;
  log: LogConfig;
  port: number;
  serveStaticAssets: boolean;
  urlPrefix: string;
  defaults: any;
  httpHeaders?: Record<string, string>;
  prometheusUsername?: string;
  prometheusPassword?: string;
}

const config: Record<Env, Config> = {
  development: {
    googleAnalyticsKey: "",
    postgres: {
      connectionString: process.env.POSTGRES_URL,
    },
    log: {
      name: "postcodes.io",
      file: "stdout",
    },
    port: 8000,
    serveStaticAssets: true,
    urlPrefix: "",
    defaults,
  },

  test: {
    googleAnalyticsKey: "",
    postgres: {
      connectionString:
        "postgres://postcodesio:password@localhost:5432/postcodeio_testing",
    },
    log: {
      name: "postcodes.io",
      file: join(__dirname, "../test.log"),
    },
    port: 8000,
    serveStaticAssets: true,
    urlPrefix: "",
    defaults,
  },

  production: {
    googleAnalyticsKey: "",
    postgres: {
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
        sslMode: "require",
      },
    },
    log: {
      name: "postcodes.io",
      file: "perf", // Use pino.extreme
    },
    port: 8000,
    serveStaticAssets: false,
    urlPrefix: "",
    defaults,
  },
};

export const getConfig = (env?: Env): Config => {
  const environment = env || defaultEnv;

  const cfg = config[environment as Env];

  const {
    PORT,
    LOG_NAME,
    GA_KEY,
    LOG_DESTINATION,
    PROMETHEUS_USERNAME,
    PROMETHEUS_PASSWORD,
    SERVE_STATIC_ASSETS,
    HTTP_HEADERS,
    URL_PREFIX,
  } = process.env;

  if (PORT !== undefined) cfg.port = parseInt(PORT, 10);

  if (LOG_NAME !== undefined) cfg.log.name = LOG_NAME;
  if (LOG_DESTINATION !== undefined) cfg.log.file = LOG_DESTINATION;

  if (GA_KEY !== undefined) cfg.googleAnalyticsKey = GA_KEY;

  if (PROMETHEUS_USERNAME !== undefined)
    cfg.prometheusUsername = PROMETHEUS_USERNAME;
  if (PROMETHEUS_PASSWORD !== undefined)
    cfg.prometheusPassword = PROMETHEUS_PASSWORD;

  if (SERVE_STATIC_ASSETS !== undefined)
    cfg.serveStaticAssets = SERVE_STATIC_ASSETS.toLowerCase() !== "false";

  if (URL_PREFIX !== undefined) cfg.urlPrefix = URL_PREFIX;

  try {
    if (HTTP_HEADERS !== undefined) cfg.httpHeaders = JSON.parse(HTTP_HEADERS);
  } catch (error) {
    process.stdout.write(
      "Invalid HTTP Header configuration. Please supply valid JSON string for HTTP_HEADERS"
    );
    throw error;
  }

  return cfg;
};
