import type { NextApiRequest, NextApiResponse } from 'next'
import { DAPP_ADDRESS, APTOS_NODE_URL } from '../../../config/constants';
import { AptosClient } from 'aptos';

type Data = {
    id: any,
    message: string,
    address: string,
    timestamp: number,
    response: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const { id } = req.query;
    const client = new AptosClient(APTOS_NODE_URL);
    const request = {
        function: `${DAPP_ADDRESS}::helloworld::get_message`,
        type_arguments: [],
        arguments: [id]
    }
    const response = await client.view(request)

    if (response.toString().startsWith("http")) {
        res.redirect(301, response.toString());
    } else {
        res.status(200).json({ id, response, address: DAPP_ADDRESS, message: 'Hello, link web3 World!', timestamp: Date.now() });
    }


}
