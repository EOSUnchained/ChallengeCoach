#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>

using namespace eosio;

// Smart Contract Name: notechain
// Table struct:
//   notestruct: multi index table to store the notes
//     prim_key(uint64): primary key
//     user(name): account name for the user
//     note(string): the note message
//     timestamp(uint64): the store the last update block time
// Public method:
//   isnewuser => to check if the given account name has note in table or not
// Public actions:
//   update => put the note into the multi-index table and sign by the given account

// Replace the contract class name when you start your own project
CONTRACT ccoach : public eosio::contract {
  private:
    bool isnewuser( name user ) {
      // get notes by using secordary key
      auto user_index = _users.get_index<name("getbyuser")>();
      auto user_iterator = user_index.find(user.value);

      return user_iterator == user_index.end();
    }

    // bool isnewchallenge( uint64_t challangeId ) {  //TODO
    //   // get notes by using secordary key
    //   auto user_index = _users.get_index<name("getbyuser")>();
    //   auto user_iterator = user_index.find(user.value);

    //   return user_iterator == user_index.end();
    // }

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

    // ----- GAMES table start -----
    TABLE gamestruct
    {
      // uint64_t prim_key;       // primary key
      name user;               // account name for the user
      std::string challenge;
      // uint64_t stakeAmount; // the note message
      // uint64_t timestamp;      // the store the last update block time

      uint64_t primary_key() const { return user.value; }
      std::string secondary_key() const {return challenge; }

    };
    // typedef eosio::multi_index<name("gamestruct"), gamestruct, indexed_by<"user"_n, const_mem_fun<gamestruct, std::string, &gamestruct::secondary_key>>> games;
    typedef eosio::multi_index<"user"_n, gamestruct> games;
    //// local instances of the multi index
    games _games;
    // ----- GAMES table end -----

    // ----- DEPOSIT table start -----
    TABLE deposit
    {
      // uint64_t prim_key;       // primary key
      name user;               // account name for the user
      int64_t balance;
      // uint64_t stakeAmount; // the note message
      // uint64_t timestamp;      // the store the last update block time

       uint64_t primary_key() const { return user.value; }
       uint64_t get_by_user() const { return user.value; }
    };
    typedef eosio::multi_index<"user"_n, deposit> deposits;
    // typedef eosio::multi_index<name("deposit"), deposit, 
    // indexed_by<"user"_n, const_mem_fun<deposit, uint64_t, &deposit::get_by_user>>> deposits;
    // indexed_by<"user"_n, const_mem_fun<deposit> deposits;

    //// local instances of the multi index
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
                _challenges( receiver, receiver.value ) {}

    //   ACTION newuser(std::string& challengeName, uint64_t coach) {
    //   // to sign the action with the given account
    //   // require_auth( coach ); // TODO how to auth it's a valid on chain coach?

    //   // create new user
    //     _users.emplace( _self, [&]( auto& new_user ) {
    //       new_user.prim_key    = _users.available_primary_key();
    //       new_user.user        = user;
    //       new_user.name        = name;
    //       new_user.stake       = stake;
    //     });
    // }

    ACTION newchallenge(std::string& challengeName, uint64_t coach) {
      // to sign the action with the given account
      // require_auth( coach ); // TODO how to auth it's a valid on chain coach?

      // create new challenge
      _challenges.emplace( _self, [&]( auto& new_challenge ) {
          new_challenge.challengeId  = _challenges.available_primary_key();
          new_challenge.challengeName = challengeName;
          new_challenge.totalStake    = 0;
          new_challenge.coach         = coach;
        });
      // if (isnewchallenge(user)) {
      //   // insert new note
      //   _challenges.emplace( _self, [&]( auto& new_challenge ) {
      //     new_challenge.prim_key      = _challenges.available_primary_key();
      //     new_challenge.challenge_id  = challenge_id;
      //     new_challenge.challengeName = challengeName;
      //     new_challenge.totalStake    = 0;
      //     new_challenge.coach         = coach;
      //   });
      // } else {
      //   // get object by secordary key
      //   auto note_index = _notes.get_index<name("getbyuser")>();
      //   auto &note_entry = note_index.get(user.value);
      //   // update existing note
      //   _notes.modify( note_entry, _self, [&]( auto& modified_user ) {
      //     modified_user.note      = note;
      //     modified_user.timestamp = now();
      //   });
      // }
    }

    // upon receiving eos the user is enrolled in the challenge of choice 
    ACTION receiveeos( name user, std::string& name,  uint16_t stake, uint64_t challenge_key) {
      // to sign the action with the given account
      require_auth( user ); //scatter use?

      // create new / update note depends whether the user account exist or not
      if (isnewuser(user)) {
        // insert new user
        _users.emplace( _self, [&]( auto& new_user ) {
          new_user.prim_key    = _users.available_primary_key();
          new_user.user        = user;
          new_user.name        = name;
          new_user.stake       = stake;
        });
      } else {
        // get object by secordary key
        // auto user_index = _users.get_index<name("getbyuser")>();
        // auto &user_entry = user_index.get(user.value);

        //RJS need to call an inline action? 
        // a) to enroll in challenge?
        // b) actually transfer eos

        // // update existing user
        // _users.modify( user_entry, _self, [&]( auto& modified_user ) {
        //   modified_user.stake      = stake;
          
        // });
      }
    }

    ACTION startgame( name user, std::string& challenge, int64_t stakeAmount) {
      require_auth( user ); //scatter use?
      // create new / update note depends whether the user account exist or not
      // if (isnewuser(user)) {
        // insert new note
        _games.emplace(_self, [&](auto &new_user) {
          new_user.user = user;
          new_user.challenge = challenge;
        });
      // } else {
      //   auto game_index = _games.get_index<name("getbyuser")>();
      //   auto &game_entry = game_index.get(user.value);
      //   // update existing note
      //   _games.modify(game_entry, _self, [&](auto &modified_user) {
      //     modified_user.challenge = challenge;
      //   });

      // }

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

};

// specify the contract name, and export a public action: update
EOSIO_DISPATCH( ccoach, (newchallenge)(receiveeos)(startgame) )
