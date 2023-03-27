import { APTOS_FAUCET_URL, APTOS_NODE_URL, DAPP_ADDRESS } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { WalletClient } from '@martiandao/aptos-web3-bip44.js';
import { useEffect, useState } from 'react';

export default function Home() {
    const defaultResource = `${DAPP_ADDRESS}::helloworld::NamedValue`;
    const [resource, updateResource] = useState(defaultResource);
    const { account, network, signAndSubmitTransaction } = useWallet();
    const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
    const [balance, updateBalance] = useState(0);
    const [contractData, updateData] = useState<any>({});
    const [init, updateInit] = useState(false);

    const [updateInput, doUpdateUpdateInput] = useState({
        value: "",
        message: ""
    });

    const loadResource = async () => {
        if (account && account.address) {
            const address = account.address?.toString();
            try {
                const result = await client.aptosClient.getAccountResource(address, resource);
                updateData(result);
                updateInit(true);
                const data: any = result.data;
                doUpdateUpdateInput({ message: data.message, value: data.value });
            } catch (error) {
                updateInit(false);
            }
        }
    }

    const initParams = () => {
        return {
            type: 'entry_function_payload',
            function: `${DAPP_ADDRESS}::helloworld::make_value`,
            type_arguments: [],
            arguments: [0, "hello world"],
        };
    }

    async function initResource() {
        await signAndSubmitTransaction(initParams(), { gas_unit_price: 100 }).then(() => {
            setTimeout(loadResource, 3000);
        });
    }


    const updateParams = () => {
        return {
            type: 'entry_function_payload',
            function: `${DAPP_ADDRESS}::helloworld::update_message_value`,
            type_arguments: [],
            arguments: [updateInput.message, updateInput.value],
        }
    }

    async function doAtposUpdate() {
        await signAndSubmitTransaction(updateParams(), { gas_unit_price: 100 }).then(() => {
            setTimeout(loadResource, 3000);
        });
    }

    useEffect(() => {
        (async () => {
            if (account) {
                const address = account.address?.toString();
                if (address) {
                    const currentBlance = await client.getBalance(address);
                    updateBalance(currentBlance);
                    console.log(address);
                    loadResource();
                }
            }
        })()
    }, [
        account
    ])





    const doTest = async () => {

        const testParams = () => {
            return {
                type: 'entry_function_payload',
                type_arguments: [],
                function: '1558a1c3dd29e4b0bac3f30fb1030c0b25df408524cdcc59e0cec7e7aa1a5462::example::callme',
                arguments: [],
            }
        }

        console.log("this is a test");

        await signAndSubmitTransaction(testParams(), { gas_unit_price: 500 }).then(() => {
            setTimeout(loadResource, 3000);
        });
    }

    return (
        <>

            <button onClick={doTest} className="btn btn-primary border-spacing-3 shadow-xl">Test Call</button>

            <div className="card w-2/4 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Hello aptos todo system.</h2>
                    <ul>
                        <li>Account : {account?.address?.toString()}</li>
                        <li>Network: {network?.name}</li>
                        <li>Balance: {balance}</li>
                    </ul>
                </div>
            </div>
            <div className="mt-5">
                {
                    init ? (<></>) : (<button className="btn btn-info" onClick={initResource}>Init Message 1 </button>)
                }
            </div>



            <div className="card w-2/4 bg-base-100 shadow-xl mt-2">
                <div className="card-body">
                    <h2 className="card-title">update resource</h2>
                    <input type="text" placeholder="Resource value"
                        className="input input-bordered w-full"
                        value={updateInput.value}
                        onChange={(e) => {
                            doUpdateUpdateInput({ ...updateInput, value: e.target.value })
                        }} />
                    <input type="text" placeholder="Resource value"
                        className="input input-bordered w-full"
                        value={updateInput.message}
                        onChange={(e) => { doUpdateUpdateInput({ ...updateInput, message: e.target.value }) }} />
                    <div className="card-actions justify-end">
                        <button onClick={doAtposUpdate} className="btn btn-primary">Update name & value</button>
                    </div>
                </div>
            </div>


            <div className="card w-2/4 bg-base-100 shadow-xl mt-2">
                <div className="card-body">
                    <h2 className="card-title">load resource</h2>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full" value={resource} onChange={(e) => { updateResource(e.target.value) }} />
                    <div className="card-actions justify-end">
                        <button onClick={loadResource} className="btn btn-primary">Load</button>
                    </div>
                </div>
            </div>

            <h2>Contract Data : </h2>
            <pre>{JSON.stringify(contractData, null, 2)}</pre>

        </>
    )
}