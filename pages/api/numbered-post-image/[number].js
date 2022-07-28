const make6xUrl = number => `https://ss-full.vercel.app/api?doNotAddStyles=true&waitForAssemble=true&height=3600&width=2400&url=https%3A%2F%2Fas.hack.af%2Fs%2F${number}%3Fid%3D4%26scale6x%3Dtrue`;
const make3xUrl = number => `https://ss-full.vercel.app/api?doNotAddStyles=true&waitForAssemble=true&height=1800&width=1200&url=https%3A%2F%2Fas.hack.af%2Fs%2F${number}%3Fid%3D4%26scale%3Dtrue`;

import fetch from 'node-fetch';

export default async (req, res) => {
    const { number } = req.query
    
    try {
        const url = make6xUrl(number);
        const response = await fetch(url);
        if (new String(response.status).startsWith('5') || new String(response.status).startsWith('4')) throw 'too large or something idrk';
        
        const data = await response.buffer();

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': data.length
        });
        res.end(data);
    } catch (err) {
        console.error(err);
        const url = make3xUrl(number);
        const response = await fetch(url);
        if (new String(response.status).startsWith('5') || new String(response.status).startsWith('4')) throw 'too large or something idrk';
        
        const data = await response.buffer();

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': data.length
        });
        res.end(data);
    }
}
