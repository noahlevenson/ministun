#!/usr/bin/env bash

set -e

node $GITHUB_WORKSPACE/test/mattr.spec.js
node $GITHUB_WORKSPACE/test/mhdr.spec.js
node $GITHUB_WORKSPACE/test/mmsg.spec.js
node $GITHUB_WORKSPACE/test/mutil.spec.js
node $GITHUB_WORKSPACE/test/ministun.spec.js
