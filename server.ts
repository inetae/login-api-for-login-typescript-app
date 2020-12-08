import express from 'express';
import cors, { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import login from './routes/login';
import servers from './routes/servers';
import 'dotenv/config';

const app = express();

const whitelistedUrl = [
    'http://localhost:8080',
    'http://127.0.0.1:9001'
];

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
        if (!origin || whitelistedUrl.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn('Origin is not in the list', origin);
            callback('Unexpected error occurred');
        }
    },
};

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());

app.use(cors(corsOptions));

app.use(express.json());

app.use('/login', login);

app.use('/api/servers', servers);

app.listen(app.get('port'), () =>  console.log(`Service running on port ${app.get('port')}`));
