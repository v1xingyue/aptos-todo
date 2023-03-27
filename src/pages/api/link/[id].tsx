import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    id: any,
    message: string,
    timestamp: number
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const { id } = req.query;
    res.status(200).json({ id, message: 'Hello, link web3 World!', timestamp: Date.now() });
}
