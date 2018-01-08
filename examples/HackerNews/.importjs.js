module.exports = {
  environments: ['browser', 'jest'],
  declarationKeyword: 'import',
  namedExports: {
    reselect: ['createSelector', 'createStructuredSelector'],
    'lodash/fp': [
      'F',
      'T',
      '__',
      '_baseConvert',
      '_convertBrowser',
      '_falseOptions',
      '_mapping',
      '_util',
      'add',
      'after',
      'all',
      'allPass',
      'always',
      'any',
      'anyPass',
      'apply',
      'array',
      'ary',
      'assign',
      'assignAll',
      'assignAllWith',
      'assignIn',
      'assignInAll',
      'assignInAllWith',
      'assignInWith',
      'assignWith',
      'assoc',
      'assocPath',
      'at',
      'attempt',
      'before',
      'bind',
      'bindAll',
      'bindKey',
      'camelCase',
      'capitalize',
      'castArray',
      'ceil',
      'chain',
      'chunk',
      'clamp',
      'clone',
      'cloneDeep',
      'cloneDeepWith',
      'cloneWith',
      'collection',
      'commit',
      'compact',
      'complement',
      'compose',
      'concat',
      'cond',
      'conforms',
      'conformsTo',
      'constant',
      'contains',
      'convert',
      'countBy',
      'create',
      'curry',
      'curryN',
      'curryRight',
      'curryRightN',
      'date',
      'debounce',
      'deburr',
      'defaultTo',
      'defaults',
      'defaultsAll',
      'defaultsDeep',
      'defaultsDeepAll',
      'defer',
      'delay',
      'difference',
      'differenceBy',
      'differenceWith',
      'dissoc',
      'dissocPath',
      'divide',
      'drop',
      'dropLast',
      'dropLastWhile',
      'dropRight',
      'dropRightWhile',
      'dropWhile',
      'each',
      'eachRight',
      'endsWith',
      'entries',
      'entriesIn',
      'eq',
      'equals',
      'escape',
      'escapeRegExp',
      'every',
      'extend',
      'extendAll',
      'extendAllWith',
      'extendWith',
      'fill',
      'filter',
      'find',
      'findFrom',
      'findIndex',
      'findIndexFrom',
      'findKey',
      'findLast',
      'findLastFrom',
      'findLastIndex',
      'findLastIndexFrom',
      'findLastKey',
      'first',
      'flatMap',
      'flatMapDeep',
      'flatMapDepth',
      'flatten',
      'flattenDeep',
      'flattenDepth',
      'flip',
      'floor',
      'flow',
      'flowRight',
      'forEach',
      'forEachRight',
      'forIn',
      'forInRight',
      'forOwn',
      'forOwnRight',
      'fromPairs',
      'function',
      'functions',
      'functionsIn',
      'get',
      'getOr',
      'groupBy',
      'gt',
      'gte',
      'has',
      'hasIn',
      'head',
      'identical',
      'identity',
      'inRange',
      'includes',
      'includesFrom',
      'indexBy',
      'indexOf',
      'indexOfFrom',
      'init',
      'initial',
      'intersection',
      'intersectionBy',
      'intersectionWith',
      'invert',
      'invertBy',
      'invertObj',
      'invoke',
      'invokeArgs',
      'invokeArgsMap',
      'invokeMap',
      'isArguments',
      'isArray',
      'isArrayBuffer',
      'isArrayLike',
      'isArrayLikeObject',
      'isBoolean',
      'isBuffer',
      'isDate',
      'isElement',
      'isEmpty',
      'isEqual',
      'isEqualWith',
      'isError',
      'isFinite',
      'isFunction',
      'isInteger',
      'isLength',
      'isMap',
      'isMatch',
      'isMatchWith',
      'isNaN',
      'isNative',
      'isNil',
      'isNull',
      'isNumber',
      'isObject',
      'isObjectLike',
      'isPlainObject',
      'isRegExp',
      'isSafeInteger',
      'isSet',
      'isString',
      'isSymbol',
      'isTypedArray',
      'isUndefined',
      'isWeakMap',
      'isWeakSet',
      'iteratee',
      'join',
      'juxt',
      'kebabCase',
      'keyBy',
      'keys',
      'keysIn',
      'lang',
      'last',
      'lastIndexOf',
      'lastIndexOfFrom',
      'lowerCase',
      'lowerFirst',
      'lt',
      'lte',
      'map',
      'mapKeys',
      'mapValues',
      'matches',
      'matchesProperty',
      'math',
      'max',
      'maxBy',
      'mean',
      'meanBy',
      'memoize',
      'merge',
      'mergeAll',
      'mergeAllWith',
      'mergeWith',
      'method',
      'methodOf',
      'min',
      'minBy',
      'mixin',
      'multiply',
      'nAry',
      'negate',
      'next',
      'noop',
      'now',
      'nth',
      'nthArg',
      'number',
      'object',
      'omit',
      'omitAll',
      'omitBy',
      'once',
      'orderBy',
      'over',
      'overArgs',
      'overEvery',
      'overSome',
      'pad',
      'padChars',
      'padCharsEnd',
      'padCharsStart',
      'padEnd',
      'padStart',
      'parseInt',
      'partial',
      'partialRight',
      'partition',
      'path',
      'pathEq',
      'pathOr',
      'paths',
      'pick',
      'pickAll',
      'pickBy',
      'pipe',
      'placeholder',
      'plant',
      'pluck',
      'prop',
      'propEq',
      'propOr',
      'property',
      'propertyOf',
      'props',
      'pull',
      'pullAll',
      'pullAllBy',
      'pullAllWith',
      'pullAt',
      'random',
      'range',
      'rangeRight',
      'rangeStep',
      'rangeStepRight',
      'rearg',
      'reduce',
      'reduceRight',
      'reject',
      'remove',
      'repeat',
      'replace',
      'rest',
      'restFrom',
      'result',
      'reverse',
      'round',
      'sample',
      'sampleSize',
      'seq',
      'set',
      'setWith',
      'shuffle',
      'size',
      'slice',
      'snakeCase',
      'some',
      'sortBy',
      'sortedIndex',
      'sortedIndexBy',
      'sortedIndexOf',
      'sortedLastIndex',
      'sortedLastIndexBy',
      'sortedLastIndexOf',
      'sortedUniq',
      'sortedUniqBy',
      'split',
      'spread',
      'spreadFrom',
      'startCase',
      'startsWith',
      'string',
      'stubArray',
      'stubFalse',
      'stubObject',
      'stubString',
      'stubTrue',
      'subtract',
      'sum',
      'sumBy',
      'symmetricDifference',
      'symmetricDifferenceBy',
      'symmetricDifferenceWith',
      'tail',
      'take',
      'takeLast',
      'takeLastWhile',
      'takeRight',
      'takeRightWhile',
      'takeWhile',
      'tap',
      'template',
      'templateSettings',
      'throttle',
      'thru',
      'times',
      'toArray',
      'toFinite',
      'toInteger',
      'toIterator',
      'toJSON',
      'toLength',
      'toLower',
      'toNumber',
      'toPairs',
      'toPairsIn',
      'toPath',
      'toPlainObject',
      'toSafeInteger',
      'toString',
      'toUpper',
      'transform',
      'trim',
      'trimChars',
      'trimCharsEnd',
      'trimCharsStart',
      'trimEnd',
      'trimStart',
      'truncate',
      'unapply',
      'unary',
      'unescape',
      'union',
      'unionBy',
      'unionWith',
      'uniq',
      'uniqBy',
      'uniqWith',
      'uniqueId',
      'unnest',
      'unset',
      'unzip',
      'unzipWith',
      'update',
      'updateWith',
      'upperCase',
      'upperFirst',
      'useWith',
      'util',
      'value',
      'valueOf',
      'values',
      'valuesIn',
      'where',
      'whereEq',
      'without',
      'words',
      'wrap',
      'wrapperAt',
      'wrapperChain',
      'wrapperLodash',
      'wrapperReverse',
      'wrapperValue',
      'xor',
      'xorBy',
      'xorWith',
      'zip',
      'zipAll',
      'zipObj',
      'zipObject',
      'zipObjectDeep',
      'zipWith',
    ],
  },
};
