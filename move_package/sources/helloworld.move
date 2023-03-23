module todo::helloworld {

    use std::signer;

    struct NamedValue has key {
        value: u64
    }

    public entry fun make_value(account:&signer,value:u64) {
        move_to(account,NamedValue{value});
    }

    public entry fun update_value(account:&signer,value:u64) acquires NamedValue{
        let addr = signer::address_of(account);
        let modify_value = borrow_global_mut<NamedValue>(addr);
        modify_value.value = value;
    }

}