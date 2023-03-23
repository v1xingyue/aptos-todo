import { DAPP_ADDRESS, APTOS_FAUCET_URL, APTOS_NODE_URL, DAPP_NAME } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { AptosAccount, WalletClient, HexString } from '@martiandao/aptos-web3-bip44.js';
import { useEffect, useState } from 'react';
export default function Home() {

    const defaultResource = "0x37748d30ffba2bca14b1754eaddd153e80a068b898f8873aefa78806adfb6568::helloworld::NamedValue";
    const [resource, updateResource] = useState(defaultResource);
    const { account, signAndSubmitTransaction, wallet, network } = useWallet();
    const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
    const [balance, updateBalance] = useState(0);

    const [contractData, updateData] = useState<any>({});

    const loadResource = async () => {
        if (account && account.address) {
            let address = account.address?.toString();
            let result = await client.aptosClient.getAccountResource(address, resource).catch(err => {
                console.log(err);
            });
            console.log(result);
            updateData(result);
        }
    }

    useEffect(() => {
        (async () => {
            if (account) {
                let address = account.address?.toString();
                if (address) {
                    let currentBlance = await client.getBalance(address);
                    console.log(currentBlance);
                    updateBalance(currentBlance);
                    console.log(address);
                    loadResource();
                }
            }
        })()
    }, [
        account
    ])



    return (
        <>
            <h2>Hello aptos todo system.</h2>
            <p>Contract : {DAPP_ADDRESS}::{DAPP_NAME}</p>
            <ul>
                <li>{account?.address?.toString()}</li>
                <li>{network?.name}</li>
                <li>Balance: {balance}</li>
            </ul>



            <div className="card w-2/4 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">load resource</h2>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full" value={defaultResource} onChange={(e) => { updateResource(e.target.value) }} />
                    <div className="card-actions justify-end">
                        <button onClick={async () => {
                            await loadResource();
                        }} className="btn btn-primary">Load</button>
                    </div>
                </div>
            </div>

            <h2>Contract Data : </h2>
            <pre>{JSON.stringify(contractData, null, 2)}</pre>


        </>
    )
}