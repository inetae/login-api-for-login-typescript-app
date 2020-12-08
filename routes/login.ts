import {Request, Response} from 'express';
const router = require('express').Router();
import axios from 'axios';

router.post('/', (request: Request, response: Response) => {
    if (response) {
        const { body, connection } = request;

        const RecaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${body.token}&remoteip=${connection.remoteAddress}`;

        if (body.token) {
            axios.post(RecaptchaUrl)
                .then((captchaResponse) => {
                    const { data } = captchaResponse;
                    if (!captchaResponse) return response.status(400).json({
                        type: 'failed',
                        response: 'wrong status',
                    });

                    if (!data.success) return response.status(400).json({
                        type: 'failed',
                        response: 'wrong captcha',
                    });

                    if (data.success) {
                        const options = {
                            username: body.username,
                            password: body.password
                        };

                        axios.post(`${process.env.TESONET_API}/tokens`, options)
                            .then((result) => {
                                console.log(response, ' response');
                                return response
                                    .cookie('access_token', result.data.token, {
                                        maxAge: 86400,
                                        httpOnly: true
                                    })
                                    .json(result.data);
                            })
                            .catch((result) => {
                                return response.json(result.response.data);
                            })
                    }
                })
                .catch(() => {
                    return response.json({
                        response: 'captcha has error',
                    });
                });

        } else {
            return response.json({
                response: 'error',
            });
        }
    }
});
export default router;