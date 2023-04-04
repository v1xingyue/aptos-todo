module todo::transfer {

    use aptos_framework::aptos_account::{Self};

    public entry fun transfer(account:&signer,value:u64,addr:address) {
        aptos_account::transfer(account,addr,value);
    }

    public entry fun transfer2(account:&signer,addr:address,value:u64) {
        aptos_account::transfer(account,addr,value);
    }
    
}