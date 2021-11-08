import { FileHelper } from './../helpers/fileHelper';
import { User } from "../entity/User";
import { BaseController } from "./BaseController";
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import config from '../configuration/config';
import * as md5 from 'md5';

export class UserController extends BaseController<User> {

    constructor() {
        super(User);
    }

    async auth(request: Request) {
        let { email, password } = request.body;
        if (!email || !password) {
            return { status: 400, message: 'Informe o email e a senha para efetuar o login' };
        }
        let user = await this.repository.findOne({ email: email, password: md5(password) });
        if (user) {
            let _payload = {
                uid: user.uid,
                name: user.name,
                photo: user.photo,
                email: user.email,
                origin: 'User'
            }
            return {
                status: 200,
                message: {
                    user: _payload,
                    token: sign({
                        ..._payload,
                        tm: new Date().getTime()
                    }, config.secretKey)
                }
            }
        } else {
            return { status: 404, message: 'Email ou senha inválidos.' }
        }
    }

    async createUser(request: Request) {
        let { name, photo, email, password, confirmPassword, isRoot } = request.body;

        super.isRequired(name, 'O nome do usuário é obrigatório!');
        super.isRequired(photo, 'A foto do usuário é obrigatória!');
        super.isRequired(email, 'O email do usuário é obrigatório!');
        super.isRequired(password, 'A senha do usuário é obrigatória!');

        let _user = new User();
        _user.name = name;
        _user.photo = photo;
        _user.email = email;

        if (password != confirmPassword) {
            return { status: 400, errors: ['A senha e a confirmação são diferentes.'] };
        } else {
            if (password) {
                _user.password = md5(password);
            }
        }

        _user.isRoot = isRoot;

        if (_user.photo) {
            let pictureCreatedResult = await FileHelper.writePicture(_user.photo);
            if (pictureCreatedResult) {
                _user.photo = pictureCreatedResult;
            }
        }

        return super.save(_user, request, true);
    }


    async save(request: Request) {
        let _user = <User>request.body;
        super.isRequired(_user.name, 'O nome do usuário é obrigatório!');
        super.isRequired(_user.photo, 'A foto do usuário é obrigatória!');
        super.isRequired(_user.email, 'O email do usuário é obrigatório!');

        if (_user.photo) {
            let pictureCreatedResult = await FileHelper.writePicture(_user.photo);
            if (pictureCreatedResult) {
                _user.photo = pictureCreatedResult;
            }
        }

        if (_user.uid) {
            delete _user.password;
        }



        return super.save(_user, request);
    }
}