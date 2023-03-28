import type { NextApiRequest, NextApiResponse } from 'next'
import { DAPP_ADDRESS } from '../../../config/constants';

type Data = {
    id: any,
    message: string,
    address: string,
    timestamp: number
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { id } = req.query;
    res.status(200).json({ id, address: DAPP_ADDRESS, message: 'Hello, link web3 World!', timestamp: Date.now() });
}
