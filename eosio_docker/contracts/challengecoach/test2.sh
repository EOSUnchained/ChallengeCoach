#!/bin/bash

shopt -s expand_aliases
source ~/.bash_profile

echo -e "\n unlock wallet "
cleos wallet unlock --password PW5Jz9SXNP8HWWdnCdykFXGFYrwqWt7W2HkBbsiPVj42P3ysHvZEd
echo -e "\n compile "
eosio-cpp -o challengecoach.wasm challengecoach.cpp --abigen --contract ccoach
echo -e "\n setting contract "
cleos set contract testacc /opt/eosio/bin/contracts/challengecoach/ --permission testacc@active

# echo -e "\n cleaning up"
# cleos push action testacc cleanreset '' -p testacc@active

# sleep 2s


# echo -e "\n pushing action startgame"
# cleos push action testacc2 startgame '["testacc2","rapid", 25]' -p testacc2@active
# cleos push action testacc startgame '["bob","rapid", 10]' -p bob@active
# cleos push action testacc startgame '["alice","rapid", 50]' -p alice@active

# sleep 1s
# echo -e "\n query table depoist game"
# cleos get table testacc testacc deposit
# cleos get table testacc testacc gamestruct

# sleep 1s
# echo -e "\n pushing action coachdecide"
# cleos push action testacc coachdecide '["bob","rapid", 0, "image.url", "hashstring"]' -p testacc@active
# cleos push action testacc coachdecide '["alice","rapid", 1, "image.url_x", "hashstring_x"]' -p testacc@active

# sleep 1s
# echo -e "\n query table resut"
# cleos get table testacc testacc resultstruct

# sleep 1s
# echo -e "\n pushing action endgame"
# cleos push action testacc endgame '["rapid"]' -p testacc@active