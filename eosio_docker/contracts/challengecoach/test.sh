#!/bin/bash

shopt -s expand_aliases
source ~/.bash_profile

echo -e "\n unlock wallet "
cleos wallet unlock --password PW5KicGjTrJWi3pwM7CqyjuKVDBjZ9s2PAMYxLqNih6qZytBPk7y2
echo -e "\n compile "
eosio-cpp -o challengecoach.wasm challengecoach.cpp --abigen --contract ccoach
echo -e "\n setting contract "
cleos set contract testacc2 /opt/eosio/bin/contracts/challengecoach/ --permission testacc2@active


echo -e "\n pushing action"
cleos push action testacc2 newchallenge '["challenge1",1]' -p testacc2@active
echo -e "\n query table"
cleos get table testacc2 testacc2 deposit