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
# cleos push action testacc2 startgame '["testacc2","rapid", 25]' -p testacc2@active
cleos push action testacc2 startgame '["bob","rapid", 10]' -p bob@active
cleos push action testacc2 startgame '["alice","rapid", 50]' -p alice@active
echo -e "\n query table"
cleos get table testacc2 testacc2 deposit