import { APTOS_NODE_URL, DAPP_ADDRESS } from '../config/constants';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { AptosClient, CoinClient } from "aptos";
import { useEffect, useState } from 'react';


const resourceList = [
    `${DAPP_ADDRESS}::helloworld::NamedValue`,
    `${DAPP_ADDRESS}::collec::TodoList`,
    `${DAPP_ADDRESS}::collec::TodoList`
]

const defaultExecuteJSON = () => {
    return JSON.stringify({
        type: 'entry_function_payload',
        function: `${DAPP_ADDRESS}::helloworld::update_message_value`,
        type_arguments: [],
        arguments: ["", 300],
    }, null, 2);
}

export default function Home() {
    const client = new AptosClient(APTOS_NODE_URL);
    const coinClient = new CoinClient(client);
    const defaultResource = `${DAPP_ADDRESS}::helloworld::NamedValue`;
    const [resource, updateResource] = useState(defaultResource);
    const { account, network, signAndSubmitTransaction } = useWallet();
    const [balance, updateBalance] = useState(BigInt(0));
    const [contractData, updateData] = useState<any>({});
    const [init, updateInit] = useState(false);

    const [updateInput, doUpdateUpdateInput] = useState({
        value: "",
        message: ""
    });

    const [executeJSON, updateExecuteJSON] = useState(defaultExecuteJSON())


    const loadResource = async () => {
        if (account && account.address) {
            const address = account.address?.toString();
            try {
                const result = await client.getAccountResource(address, resource);
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

    async function executeJSONTransaction() {
        const params = JSON.parse(executeJSON)
        await signAndSubmitTransaction(params, { gas_unit_price: 100 }).then(() => {
            setTimeout(loadResource, 3000);
        });
    }

    useEffect(() => {
        (async () => {
            if (account) {
                const address = account.address?.toString();
                if (address) {
                    const currentBlance = await coinClient.checkBalance(address);
                    updateBalance(currentBlance);
                    loadResource();
                }
            }
        })()
    }, [
        account
    ])


    const loadTaskByKey = async (handle: string, key: string) => {
        const tableItem = await client.getTableItem(handle, {
            key_type: "u64",
            value_type: `${DAPP_ADDRESS}::collec::Task`,
            key,
        });
        console.log(tableItem);
        alert(JSON.stringify(tableItem, null, 2));
    }

    const doTest = async () => {

        const testParams = () => {
            return {
                type: 'entry_function_payload',
                type_arguments: [],
                function: '0x8b0fcef1ddc91f91a877990dad30b73a317401bf85c003a3b8499e96d84aa709::transfer::transfer2',
                arguments: [
                    "0x3ee0661c3e99c34d502daa36a2bd12b6b3bd52b6762c2f071cddd6a187b17309",
                    10 * 1000 * 1000
                ],
            }
        }

        console.log("this is a test");

        await signAndSubmitTransaction(testParams(), { gas_unit_price: 500 }).then(() => {
            setTimeout(loadResource, 3000);
        });
    }

    return (
        <>

            <div className="card w-3/4 bg-base-100 shadow-xl mt-3">
                <div className="card-body">
                    <h2 className="card-title">Aptos json execute : </h2>
                    <textarea
                        className="textarea textarea-primary "
                        rows={10}
                        placeholder="Bio"
                        value={executeJSON}
                        onChange={(e) => {
                            updateExecuteJSON(e.target.value)
                        }}
                    />
                    <div className="card-actions justify-end">
                        <button onClick={executeJSONTransaction} className="btn btn-primary">Execute Json</button>
                    </div>
                </div>
            </div>

            <button onClick={doTest} className="btn btn-primary border-spacing-3 shadow-xl">Test Transfer</button>
            <button onClick={() => loadTaskByKey("0x66b8c808a5cc2337deae5d18ebd94920dfc317fd28461a49c90987b0ff6c195d", "1")} className="ml-3 btn btn-primary border-spacing-3 shadow-xl">Test Table Item</button>

            <div className="card w-3/4 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Hello aptos todo system.</h2>
                    <ul>
                        <li>Account : {account?.address?.toString()}</li>
                        <li>Network: {network?.name}</li>
                        <li>Balance: {balance.toString()}</li>
                    </ul>
                </div>
            </div>

            <div className="mt-5">
                {
                    init ? (<></>) : (<button className="btn btn-info" onClick={initResource}>Init Message 1 </button>)
                }
            </div>



            <div className="card w-3/4 bg-base-100 shadow-xl mt-2">
                <div className="card-body">
                    <h2 className="card-title">update resource</h2>
                    <input type="text" placeholder="Resource value"
                        className="input input-bordered w-full"
                        value={updateInput.value}
                        onChange={(e) => {
                            doUpdateUpdateInput({ ...updateInput, value: e.target.value })
                        }} />
                    <input type="text" placeholder="Resource message"
                        className="input input-bordered w-full"
                        value={updateInput.message}
                        onChange={(e) => { doUpdateUpdateInput({ ...updateInput, message: e.target.value }) }} />
                    <div className="card-actions justify-end">
                        <button onClick={doAtposUpdate} className="btn btn-primary">Update name & value</button>
                    </div>
                </div>
            </div>


            <div className="card w-3/4 bg-base-100 shadow-xl mt-2">
                <div className="card-body">
                    <h2 className="card-title">load resource</h2>


                    <select onChange={(e) => { updateResource(e.target.value) }} className="select-lg select-primary w-full mt-5">
                        {
                            resourceList.map((item, idx) => {
                                return <option key={idx} value={item}>{item}</option>;
                            })
                        }
                    </select>
                    <div className="card-actions justify-end">
                        <button onClick={loadResource} className="btn btn-primary">Load</button>
                    </div>
                </div>
            </div>

            <div className="card w-3/4 bg-base-100 shadow-xl mt-2">
                <div className="card-body">
                    <h2>Contract Data : </h2>
                    <pre>{JSON.stringify(contractData, null, 2)}</pre>
                </div>
            </div>

        </>
    )
}