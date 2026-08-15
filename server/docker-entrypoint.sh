#!/bin/sh
set -e

node seed.js
exec node server.js
