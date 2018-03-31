#!/usr/bin/env bash

DIR=$(dirname $0)
PORT=${PORT:=3000}

@confirm() {
  local message="$*"
  local result=''

  echo -n "> $message [Y/n] " >&2

  while [ -z "$result" ] ; do
    read -s -n 1 choice
    case "$choice" in
      y|Y ) result='Y' ;;
      n|N ) result='N' ;;
    esac
  done

  echo $result
}

case $(@confirm "Serve on port :$PORT?") in
  Y ) echo "Yes" ;;
  N ) echo "No" && exit 1 ;;
esac

php -S localhost:$PORT -t $DIR/examples
