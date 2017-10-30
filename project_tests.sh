#!/bin/bash
set -e

npm install
node_modules/mocha/bin/mocha spec/
