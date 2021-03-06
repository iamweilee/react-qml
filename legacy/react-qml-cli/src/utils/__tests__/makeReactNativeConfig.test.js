/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * @flow
 */

import path from 'path';
import { replacePathsInObject } from 'jest/helpers'; // eslint-disable-line import/no-unresolved
import {
  makeReactQMLConfig,
  injectPolyfillIntoEntry,
} from '../makeReactQMLConfig';

test('creates config from defaults', () => {
  const webpackConfig = require('./fixtures/webpack.config.js');
  const [configs, platforms] = makeReactQMLConfig(webpackConfig, {
    dev: true,
    root: path.resolve(__dirname, 'fixtures'),
  });

  expect(replacePathsInObject(configs)).toMatchSnapshot(
    'creates config from defaults (configs)'
  );
  expect(platforms).toMatchSnapshot('creates config from defaults (platforms)');
});

test('merges existing config', () => {
  const webpackConfig = require('./fixtures/webpack.custom.config.js');
  const [configs] = makeReactQMLConfig(webpackConfig, {
    dev: true,
    root: path.resolve(__dirname, 'fixtures'),
  });

  expect(replacePathsInObject(configs)).toMatchSnapshot(
    'merges existing config'
  );
});

describe('injects polyfill into different entries', () => {
  const fakePolyfillPath = 'path/to/polyfill.js';

  test('entry is a string', () => {
    const userEntry = './src/index.js';
    const generatedEntry = injectPolyfillIntoEntry(userEntry, fakePolyfillPath);

    expect(generatedEntry.length).toBe(2);
    expect(generatedEntry[0]).toBe(fakePolyfillPath);
  });

  test('entry is an array', () => {
    const userEntry = ['./src/index.js', './src/module.js'];
    const generatedEntry = injectPolyfillIntoEntry(userEntry, fakePolyfillPath);

    expect(generatedEntry[0]).toBe(fakePolyfillPath);
    expect(generatedEntry.length).toBe(3);
  });

  test('entry is an object', () => {
    const userEntry = {
      entry1: './src/index.js',
      entry2: ['./src/module.js', './src/vendor.js'],
    };
    const expectedEntry1 = [fakePolyfillPath, './src/index.js'];

    const expectedEntry2 = [
      fakePolyfillPath,
      './src/module.js',
      './src/vendor.js',
    ];
    const generatedEntry = injectPolyfillIntoEntry(userEntry, fakePolyfillPath);

    expect(generatedEntry).toMatchObject({
      entry1: expectedEntry1,
      entry2: expectedEntry2,
    });
  });
});
