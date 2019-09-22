#!/usr/bin/env node
if (process.env.LOCAL_DEBUG) {
  require('../src')
} else {
  require('../lib')
}
