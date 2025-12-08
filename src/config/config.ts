import dotenv from 'dotenv';
dotenv.config();

interface configInterface {
    serverPORT: string;
    // apiurl: string | undefined;
}

export const config: configInterface = {
    serverPORT: process.env.PORT!,
    // apiurl: 
}