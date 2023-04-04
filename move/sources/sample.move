module todo::examle {

    struct SampleValue has key {
        value: u64
    }

    public entry fun callme(account:&signer){
        move_to(account,SampleValue{value:12333});
    }
}