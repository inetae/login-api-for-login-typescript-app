import { NextFunction, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import router from './login';

interface Request {
    token?: string;
    headers: any;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        next();
    } else {
        res.status(403).json({message: 'Something wrong'});
    }
};

router.get('/', verifyToken, (request: Request, response: Response) => {
    const { token } = request;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    axios.get('http://playground.tesonet.lt/v1/servers', config)
        .then((result: AxiosResponse) => {
            if (!result.data) response.json({ error: 'bad response from getting servers'});
            if (result.data) response.json(result.data)
        })
        .catch(error => {
            response.status(error.response.status).json(error.response.data)
        })
});

export default router;