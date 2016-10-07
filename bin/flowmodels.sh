#!/usr/bin/env node

const path = require('path');
const pkg = require('../package.json');
const opts = require('nomnom')
  .script('jscodeshift')
  .options({
    path: {
      position: 0,
      help: 'Files or directory to transform',
      list: true,
      metavar: 'FILE',
      required: true
    },
  })
  .parse();

  Runner.run(
    path.resolve(__dirname, '..', 'src', 'transform.js'),
    opts.path,
    opts
  );
