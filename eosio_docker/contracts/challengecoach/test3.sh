#!/bin/bash

shopt -s expand_aliases
source ~/.bash_profile

echo -e "\n initially gamestruct: \n"
cleos get table testacc testacc gamestruct
echo -e "\n unlock wallet "
cleos wallet unlock --password PW5JkkUFPnNfip53SHutMeEUPR6JU29m94hva1rU17V44aBY9JDGu
echo -e "\n compile "
eosio-cpp -o challengecoach.wasm challengecoach.cpp --abigen --contract ccoach
echo -e "\n setting contract "
cleos set contract testacc /opt/eosio/bin/contracts/challengecoach/ --permission testacc@active

echo -e "\n cleaning up"
cleos push action testacc cleanreset '[]' -p testacc@active

sleep 2s

cleos get table testacc testacc gamestruct