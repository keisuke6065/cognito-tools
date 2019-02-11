#!/usr/bin/env bash

rm -f ./test.csv
echo email,password,nickname,custom:test>> ./test.csv
for VAR in {1..100} ; do
    echo $(uuid)@exmaple.com,password,test${VAR},${VAR} >> ./test.csv
done
