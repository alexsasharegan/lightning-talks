#!/usr/bin/env bash

DIR=$(dirname $0)
PORT=${PORT:=3000}

php -S localhost:$PORT -t $DIR/public
