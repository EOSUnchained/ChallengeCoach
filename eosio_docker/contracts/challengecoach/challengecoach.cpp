#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <vector>
// #include<iostream>

using namespace eosio;

const name ACCOUNT_NAME = "testacc"_n;

// Replace the contract class name when you start your own project
CONTRACT ccoach : public eosio::contract {
  private:
    bool isnewuser( name user ) {
      // get notes by using secordary key
      auto user_index = _users.get_index<name("getbyuser")>();
      auto user_iterator = user_index.find(user.value);

      return user_iterator == user_index.end();
    }

    // ----- USER table start -----
    TABLE userstruct { //todo make userstruct
      uint64_t      prim_key;  // primary key
      name          user;      // account name for the user
      std::string   name;      // the user's name
      uint16_t      stake;      // user's current stake
      uint64_t      challenge_key;  // challenge key

      // primary key
      auto primary_key() const { return prim_key; }
      // secondary key
      // only supports uint64_t, uint128_t, uint256_t, double or long double
      uint64_t get_by_user() const { return user.value; }
    };

    // create a multi-index table and support secondary key
    typedef eosio::multi_index< name("userstruct"), userstruct,
      indexed_by< name("getbyuser"), const_mem_fun<userstruct, uint64_t, &userstruct::get_by_user> >
      > user_table;

    user_table _users;
    // ----- USER table end -----

    // ----- RESULTS table start -----
    TABLE resultstruct
    {
      // uint64_t prim_key;       // primary key
      name user;               // account name for the user
      uint64_t challenge;
      bool won;

      uint64_t primary_key() const { return user.value; }
      uint64_t secondary_key() const {return challenge; }

    };

    typedef eosio::multi_index<"resultstruct"_n, resultstruct, indexed_by<"getbychal"_n, const_mem_fun<resultstruct, uint64_t, &resultstruct::secondary_key>>> results;
    //// local instances of the multi index
    results _results;
    // ----- results table end -----

    // ----- GAMES table start -----
    TABLE gamestruct
    {
      // uint64_t prim_key;       // primary key
      name user;               // account name for the user
      std::string challenge;

      uint64_t primary_key() const { return user.value; }
      std::string secondary_key() const {return challenge; }

    };
    // typedef eosio::multi_index<name("gamestruct"), gamestruct, indexed_by<"user"_n, const_mem_fun<gamestruct, std::string, &gamestruct::secondary_key>>> games;
    typedef eosio::multi_index<"gamestruct"_n, gamestruct> games;
    //// local instances of the multi index
    games _games;
    // ----- GAMES table end -----

    // ----- DEPOSIT table start -----
    TABLE deposit
    {
      // uint64_t prim_key;       // primary key
      name user;               // account name for the user
      int64_t balance;

       uint64_t primary_key() const { return user.value; }
       uint64_t get_by_user() const { return user.value; }
    };
    typedef eosio::multi_index<"deposit"_n, deposit> deposits;
    deposits _deposits;
    // ----- DEPOSIT table end -----

    // ----- CHALLENGE table start -----
    TABLE challenge
    {
        uint64_t     challengeId; 
        std::string  challengeName; // name of poll
        uint64_t     coach; 
        uint64_t     totalStake; 

        uint64_t primary_key() const { return challengeId; }
        uint64_t secondary_key() const {return coach; }
    };
    typedef eosio::multi_index<name("challenge"), challenge, 
    indexed_by<"coach"_n, const_mem_fun<challenge, uint64_t, &challenge::secondary_key>>> challenges;

    //// local instances of the multi index
    challenges _challenges;
    // ----- CHALLENGE table end -----

  public:
    using contract::contract;

    // constructor
    ccoach( name receiver, name code, datastream<const char*> ds ):
                contract( receiver, code, ds ),
                _users( receiver, receiver.value ),
                _games( receiver, receiver.value ),
                _deposits( receiver, receiver.value ),
                _results( receiver, receiver.value ),
                _challenges( receiver, receiver.value ) {}

    ACTION startgame( name user, std::string& challenge, int64_t stakeAmount) {
      require_auth( user ); //scatter use?

      _games.emplace(_self, [&](auto &new_user) {
        new_user.user = user;
        new_user.challenge = challenge;
      });

      auto deposits_itr = _deposits.find(user.value);
      if(deposits_itr == _deposits.end())
      {
          _deposits.emplace(user, [&](auto &row) {
              row.user = user;
              row.balance = stakeAmount;
          });
      }
      else {
        _deposits.modify(deposits_itr, _self, [&](auto &row){
            row.balance +=stakeAmount;
        });
      }

    }
  

    uint64_t getNumericChallenge(std::string challenge){
        if (challenge == "Rapid")
          return 0;
        if(challenge == "Easy")
          return 1;
        return 2;
    }

    ACTION coachdecide( name user, std::string& challenge, bool won, std::string& imageUrl, std::string& imageHash) {
      require_auth( _self ); //scatter use      
        _results.emplace(_self, [&](auto &new_result) {
          new_result.user = user;
          new_result.challenge = getNumericChallenge(challenge);
          new_result.won = won;
        });
    }

    ACTION endgame( std::string& challenge ) {
      require_auth( _self ); 

      std::vector<std::pair<name,uint64_t> > playersWon;
      uint64_t poolSum = 0;
      auto idx = _results.get_index<"getbychal"_n>();
      auto lower = idx.lower_bound(getNumericChallenge(challenge));
      auto upper = idx.upper_bound(getNumericChallenge(challenge));
      
      
      for(auto it = lower; it != upper; it++){
          auto deposits_itr = _deposits.find((it->user).value);
          if(!(it->won))//we pool the money from losers
            poolSum += deposits_itr->balance;
            
          else // winners
            playersWon.push_back(std::make_pair(it->user, deposits_itr->balance));

          //delete their deposits
          // eosio_assert(deposits_itr != addresses.end(), "Record does not exist");
          _deposits.erase(deposits_itr);
      }

      

      

      for(auto it : playersWon){
        // printf("%s",(it.first).value);
        uint32_t amount = it.second + poolSum/playersWon.size();
        transfer_eos(_self, it.first, asset(amount, symbol("EOS",4)), "");

      }


      // printf("test###");

    }

    ACTION cleanreset() {
      require_auth( _self ); 
      // while(_games.begin() != _games.end())
      // auto games_itr = _games.find("alice"_n.value);
      // _games.erase(games_itr);
      // games_itr = _games.find("bob"_n.value);
      // _games.erase(games_itr);

      auto it = _games.begin();
      while (it != _games.end()) {
          it = _games.erase(it);
      }

      // while(_deposits.begin() != _deposits.end())
      //   _deposits.erase(_deposits.begin());
      // while(_results.begin() != _results.end())
      //   _results.erase(_results.begin());
    }

    void transfer_eos(name from, name to, asset quantity, std::string memo)
    {
        action{
            permission_level{_self, "active"_n},
            ACCOUNT_NAME,
            "transfer"_n,
            std::tuple<name, name, asset, std::string>{from, to, quantity, memo}
        }.send();
    }

    

};

// specify the contract name, and export a public action: update
EOSIO_DISPATCH( ccoach, (startgame)(endgame)(coachdecide) )
