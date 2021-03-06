/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * @flow
 */
import type { Command } from '../types';

const webpack = require('webpack');
const path = require('path');
const clear = require('clear');
const inquirer = require('inquirer');

const logger = require('../logger');
const createServer = require('../server');
const messages = require('../messages');
const exec = require('../utils/exec');
const getWebpackConfig = require('../utils/getWebpackConfig');
const { isPortTaken, killProcess } = require('../utils/haulPortHandler');

const { makeReactQMLConfig } = require('../utils/makeReactQMLConfig');

/**
 * Starts development server
 */
async function start(opts: *) {
  const isTaken = await isPortTaken(opts.port);
  if (isTaken) {
    const { userChoice } = await inquirer.prompt({
      type: 'list',
      name: 'userChoice',
      message: `Port ${opts.port} is already in use. What should we do?`,
      choices: [
        `Kill process using port ${opts.port} and start react-qml`,
        'Quit',
      ],
    });
    if (userChoice === 'Quit') {
      process.exit();
    }
    try {
      await killProcess(opts.port);
    } catch (e) {
      logger.error(`Could not kill process! Reason: \n ${e.message}`);
      process.exit(1);
    }
    logger.info(`Successfully killed processes.`);
  }

  const directory = process.cwd();
  const configPath = getWebpackConfig(directory, opts.config);

  // eslint-disable-next-line prefer-const
  let [config, platforms] = makeReactQMLConfig(
    // $FlowFixMe: Dynamic require
    require(configPath),
    {
      root: directory,
      dev: opts.dev,
      minify: opts.minify,
      port: opts.port,
    }
  );

  if (opts.platform !== 'all' && platforms.includes(opts.platform)) {
    config = config[platforms.indexOf(opts.platform)];
  }

  // Run `adb reverse` on Android
  if (opts.platform === 'android') {
    const args = `reverse tcp:${opts.port} tcp:${opts.port}`;
    const adb = process.env.ANDROID_HOME
      ? `${process.env.ANDROID_HOME}/platform-tools/adb`
      : 'adb';

    try {
      await exec(`${adb} ${args}`);
      logger.info(
        messages.commandSuccess({
          command: `${path.basename(adb)} ${args}`,
        })
      );
    } catch (error) {
      logger.warn(
        messages.commandFailed({
          command: `${path.basename(adb)} ${args}`,
          error,
        })
      );
    }
  }
  logger.info(
    messages.initialStartInformation({
      entries: Array.isArray(config) ? config.map(c => c.entry) : config.entry,
      port: opts.port,
      isMulti: Array.isArray(config),
    })
  );

  const compiler = webpack(config);

  createServer(
    compiler,
    didHaveIssues => {
      clear();
      if (didHaveIssues) {
        logger.warn(messages.bundleBuilding(didHaveIssues));
      } else {
        logger.info(messages.bundleBuilding(didHaveIssues));
      }
    },
    stats => {
      clear();
      if (stats.hasErrors()) {
        logger.error(
          messages.bundleFailed({
            errors: stats.toJson({ errorDetails: true }).errors,
          })
        );
      } else {
        logger.done(
          messages.bundleBuilt({
            stats,
            platform: opts.platform,
          })
        );
      }
    }
  ).listen(opts.port);
}

module.exports = ({
  name: 'start',
  description: 'Starts a new webpack server',
  action: start,
  options: [
    {
      name: 'port',
      description: 'Port to run your webpack server',
      default: 8081,
      parse: Number,
    },
    {
      name: 'dev',
      description: 'Whether to build in development mode',
      default: true,
      parse: (val: string) => val !== 'false',
      choices: [
        {
          value: true,
          description: 'Builds in development mode',
        },
        {
          value: false,
          description: 'Builds in production mode',
        },
      ],
    },
    {
      name: 'minify',
      description: `Whether to minify the bundle, 'true' by default when dev=false`,
      default: ({ dev }: *) => !dev,
      parse: (val: string) => val !== 'false',
      choices: [
        {
          value: true,
          description: 'Enables minification for the bundle',
        },
        {
          value: false,
          description: 'Disables minification for the bundle',
        },
      ],
    },
    {
      name: 'platform',
      description: 'Platform to bundle for',
      example: 'react-qml start --platform macos',
      required: true,
      choices: [
        {
          value: 'macos',
          description: 'Serves macOS bundle',
        },
        {
          value: 'windows',
          description: 'Serves Windows bundle',
        },
        {
          value: 'all',
          description: 'Serves all platforms',
        },
      ],
    },
    {
      name: 'config',
      description: 'Path to config file, eg. react-qml.config.js',
      default: 'react-qml.config.js',
    },
  ],
}: Command);
