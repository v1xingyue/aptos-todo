// https://fullnode.testnet.aptoslabs.com/v1/accounts/0x23a946308aa29058b0994ee34068c39493d43570e71af9244bed8592538c7332/events/{event_handle}/{field_name}

module todo::helloworld {

    use std::signer;
    use std::string;
    const ENO_MESSAGE: u64 = 0;
    use std::error;
    use aptos_framework::event;
    use aptos_framework::account;

    struct NamedValue has key {
        value: u64,
        message:string::String,
        message_change_events: event::EventHandle<MessageChangeEvent>,
    }

    struct MessageChangeEvent has drop, store {
        from_message: string::String,
        to_message: string::String,
    }

    // public entry fun make_value_1(account:&signer,value:u64,message:string::String) {
    //     move_to(account,NamedValue{value,message});
    // }

    public entry fun make_value(account:signer,value:u64,message:string::String) {
        move_to(&account,NamedValue{value,message,message_change_events: account::new_event_handle<MessageChangeEvent>(&account)});
    }

    public entry fun update_value(account:&signer,value:u64) acquires NamedValue{
        let addr = signer::address_of(account);
        let modify_value = borrow_global_mut<NamedValue>(addr);
        modify_value.value = value;
    }

    public entry fun update_message(account:&signer,message:string::String) acquires NamedValue{
        let addr = signer::address_of(account);
        let modify_value = borrow_global_mut<NamedValue>(addr);
        let from_message = modify_value.message;
        event::emit_event(&mut modify_value.message_change_events, MessageChangeEvent {
                from_message,
                to_message: copy message,
        });
        modify_value.message = message;
    }

    public entry fun update_message_value(account:&signer,message:string::String,value:u64) acquires NamedValue{
        let addr = signer::address_of(account);
        let modify_value = borrow_global_mut<NamedValue>(addr);
        let from_message = modify_value.message;
        event::emit_event(&mut modify_value.message_change_events, MessageChangeEvent {
                from_message,
                to_message: copy message,
        });
        modify_value.message = message;
        modify_value.value = value;
    }

    #[view]
    public fun get_message(addr: address): string::String acquires NamedValue {
        assert!(exists<NamedValue>(addr), error::not_found(ENO_MESSAGE));
        borrow_global<NamedValue>(addr).message
    }

}
