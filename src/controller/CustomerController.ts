
import { getRepository, In } from 'typeorm';
import { FileHelper } from './../helpers/fileHelper';
import { Customer } from "../entity/Customer";
import { BaseController } from "./BaseController";
import { Request } from 'express';
import * as md5 from 'md5';
import { sign } from 'jsonwebtoken';
import config from "../configuration/config";
import { RequestOrder } from '../entity/RequestOrder';

export class CustomerController extends BaseController<Customer> {

  private _requestOrder = getRepository(RequestOrder);

  constructor() {
    super(Customer, true);
  }

  async getMyAllOrders(request: Request) {
    const { status } = request.query;
    const where = {
      customer: request.userAuth.uid,
      deleted: false,
      statusOrder: In(!status ? [1, 2] : [status])
    }

    return this._requestOrder.find({
      where
    })
  }

  async auth(request: Request) {

    let { email, password } = request.body;
    if (!email || !password)
      return { status: 400, message: 'Informe o email e a senha para efetuar o login' };

    let user = await this.repository.findOne({ email: email, password: md5(password) });
    if (user) {
      let _payload = {
        uid: user.uid,
        name: user.name,
        photo: user.photo,
        email: user.email,
        origin: 'Customer'
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
    } else
      return { status: 404, message: 'E-mail ou senha inválidos' }
  }

  async one(request: Request) {
    const costumer = await super.one(request, this.isMe(request));
    delete costumer['password'];
    return costumer;
  }

  async changePassword(request: Request) {
    const userId = request.userAuth.uid;
    console.log('Valor do uid no changepassword = ', userId);
    const { currentPassword, newPassword, confirmPassword } = request.body;
    this.isRequired(currentPassword, 'A senha atual é obrigatória');
    this.isRequired(newPassword, 'A nova senha é obrigatória');
    this.isRequired(confirmPassword, 'A confirmação é obrigatória');
    this.isTrue(currentPassword !== confirmPassword, 'A nova senha não confere, verifique!');

    if (!this.valid) {
      return {
        status: 400,
        errors: this.allNotifications
      }
    }

    const customer = await this.repository.findOne({
      where: {
        uid: userId
      }
    });
    if (customer) {
      if (md5(currentPassword) !== customer.password) {
        return {
          status: 400,
          errors: 'A senha atual informada é inválida!'
        }
      }
      customer.password = md5(newPassword);
      this.repository.save(customer);
    } else {
      return { status: 404, message: 'Usuário não encontrado!' };
    }
  }

  async save(request: Request) {
    const _customer = <Customer>request.body;
    const { confirmPassword } = request.body;

    super.isRequired(_customer.name, 'O nome é obrigatório');
    super.isRequired(_customer.photo, 'A foto é obrigatória');
    super.isRequired(_customer.email, 'E-mail é obrigatório');
    super.isRequired(_customer.phone, 'Telefone é obrigatório');

    if (!_customer.uid) {
      super.isRequired(_customer.password, 'A senha é obrigatório');
      super.isRequired(confirmPassword, 'A confirmação da senha é obrigatório');
      super.isTrue((_customer.password != confirmPassword), 'A senha e a confirmação de senha estão diferentes');
      _customer.password = md5(_customer.password);
    } else {
      delete _customer.password;
    }

    if (_customer.photo) {
      let pictureCreatedResult = await FileHelper.writePicture(_customer.photo)
      if (pictureCreatedResult)
        _customer.photo = pictureCreatedResult
    }

    return super.save(_customer, request, this.isMe(request));

  }

  async createCustomer(request: Request) {
    let _customer = <Customer>request.body;
    let { confirmPassword } = request.body;

    super.isRequired(_customer.name, 'O nome é obrigatório');
    super.isRequired(_customer.photo, 'A foto é obrigatória');
    super.isRequired(_customer.email, 'E-mail é obrigatório');
    super.isRequired(_customer.phone, 'Telefone é obrigatório');
    super.isRequired(_customer.password, 'A senha é obrigatório');
    super.isRequired(confirmPassword, 'A confirmação da senha é obrigatório');
    super.isTrue((_customer.password != confirmPassword), 'A senha e a confirmação de senha estão diferentes');

    if (_customer.photo) {
      let pictureCreatedResult = await FileHelper.writePicture(_customer.photo)
      if (pictureCreatedResult)
        _customer.photo = pictureCreatedResult
    }

    if (_customer.password)
      _customer.password = md5(_customer.password);

    return super.save(_customer, request, true);
  }

  isMe(request: Request): boolean {
    try {
      const uid = request.params.id as string;
      const uidBody = request.body.uid;
      const userId = request.userAuth.uid;
      return (uid === userId || uidBody === userId);
    } catch (error) {
      return false;
    }
  }
}