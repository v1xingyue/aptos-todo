const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        // if (pathname === '/api/hello') {
        //     res.setHeader('Content-Type', 'application/json');
        //     res.statusCode = 200;
        //     res.end(JSON.stringify({ message: 'Hello from the API' }));
        //     return;
        // }

        if (pathname.startsWith("/short")) {
            parsedUrl.pathname = "/api" + pathname;
            return handle(req, res, parsedUrl);
        }

        if (pathname.startsWith("/link")) {
            parsedUrl.pathname = "/api" + pathname;
            return handle(req, res, parsedUrl);
        }

        handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
