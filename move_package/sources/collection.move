module todo::collec {

    use std::string;
    use std::signer;

    struct TodoBag has key {
        Items 
    }

    struct TodoBag has key {
        Name:string::String 
        Desc:string::String 
        Status:u8
    }


}