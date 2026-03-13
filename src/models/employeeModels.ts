import client from '../db/mysql';
import {Request, Response} from 'express'

export const allEmployeesModel = async (
    req: Request
): Promise<{
    data: any[];
    search: string;
}> => {
    const  conn = await client.getConnection();
    try {
        const {search} = req.query;

        const searchterm = `%${search}%`


        const query = `SELECT * FROM employee`;

        const values = [
            searchterm
        ]

        await conn.beginTransaction();
        const [rows] = await conn.query(query, values);
        await conn.commit();
        return {
            data: rows as any[],
            search: search as string,
        };
    }catch (err: any) {
        await conn.rollback();
        throw new Error(`Error getting all products: ${err.message}`);
    }
}