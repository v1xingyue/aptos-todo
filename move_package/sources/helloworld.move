module todo::helloworld {

    use std::signer;
    use std::string;
    const ENO_MESSAGE: u64 = 0;
    use std::error;

    struct NamedValue has key {
        value: u64,
        message:string::String
    }

    public entry fun make_value(account:&signer,value:u64,message:string::String) {
        move_to(account,NamedValue{value,message});
    }

    public entry fun update_value(account:&signer,value:u64) acquires NamedValue{
        let addr = signer::address_of(account);
        let modify_value = borrow_global_mut<NamedValue>(addr);
        modify_value.value = value;
    }

    public entry fun update_message(account:&signer,message:string::String) acquires NamedValue{
        let addr = signer::address_of(account);
        let modify_value = borrow_global_mut<NamedValue>(addr);
        modify_value.message = message;
    }

    #[view]
    public fun get_message(addr: address): string::String acquires NamedValue {
        assert!(exists<NamedValue>(addr), error::not_found(ENO_MESSAGE));
        borrow_global<NamedValue>(addr).message
    }

}