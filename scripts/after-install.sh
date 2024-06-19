#!/bin/bash
var=$(ps -ef |grep next-server |grep -v 'grep'|grep -v $0)
echo ${var}
pid=$(echo ${var} | cut -d " " -f2)

if [ -n "${pid}" ]
then
  kill -9 ${pid}
  echo $* is terminated.

else
  echo $* is not running.
fi

cd /home/ec2-user/test
~/.nvm/versions/node/v20.14.0/bin/npm run start &