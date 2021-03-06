import { SubCategory } from './../entity/SubCategory';
import { RequestOrder } from './../entity/RequestOrder';
import { getRepository } from 'typeorm';
import { ServiceProvider } from "../entity/ServiceProvider";
import { BaseController } from "./BaseController";
import { Request, In } from 'express';
import { sign } from 'jsonwebtoken';
import * as md5 from 'md5';
import { FileHelper } from "../helpers/fileHelper";
import config from "../configuration/config";
import { RequestStatus } from '../entity/enum/RequestStatus';

export class ServiceProviderController extends BaseController<ServiceProvider> {

  private _requestOrder = getRepository(RequestOrder);
  private _subCategories = getRepository(SubCategory);

  constructor() {
    super(ServiceProvider, true);
  }

  async getAllOrdersAvailables(request: Request) {
    const { status } = request.query;
    const where = {
      deleted: false,
      statusOrder: In(!status ? [1] : [status])
    }

    const myData = await this.repository.findOne(request.userAuth.uid);
    const categories = myData.categoriesCare.split(',').map(c => c.trim());
    const subCategories = await this._subCategories.find({
      where: {
        name: In(categories)
      }
    })

    if (Array.isArray(subCategories)) {
      where['subCategory'] = In(subCategories.map(s => s.uid));
    }


    return this._requestOrder.find({
      where
    })
  }

  async getMyOrders(request: Request) {
    const { status } = request.query;
    return this._requestOrder.find({
      where: {
        deleted: false,
        serviceProvider: request.userAuth.uid,
        statusOrder: status ? status : RequestStatus.Accepted
      }
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
        origin: 'ServiceProvider'
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
      return { status: 404, message: 'E-mail ou senha inv??lidos' }
  }

  private validationDefault(_serviceProvider: ServiceProvider): void {
    super.isRequired(_serviceProvider.name, 'O nome ?? obrigat??rio');
    super.isRequired(_serviceProvider.photo, 'A foto ?? obrigat??ria');
    super.isRequired(_serviceProvider.email, 'E-mail ?? obrigat??rio');
    super.isRequired(_serviceProvider.phone, 'Telefone ?? obrigat??rio');
    super.isRequired(_serviceProvider.categoriesCare, 'Informe as categorias atendidas');
    super.isRequired(_serviceProvider.citiesCare, 'Informe as cidades atendidas');
    super.isRequired(_serviceProvider.zipCode, 'Informe o CEP');
    super.isRequired(_serviceProvider.state, 'Informe o estado');
  }

  async save(request: Request) {
    const _serviceProvider = <ServiceProvider>request.body;
    const { confirmPassword } = request.body;

    this.validationDefault(_serviceProvider);

    if (_serviceProvider.photo) {
      let pictureCreatedResult = await FileHelper.writePicture(_serviceProvider.photo)
      if (pictureCreatedResult)
        _serviceProvider.photo = pictureCreatedResult
    }

    if (!_serviceProvider.uid) {
      super.isRequired(_serviceProvider.password, 'A senha ?? obrigat??rio');
      super.isRequired(confirmPassword, 'A confirma????o da senha ?? obrigat??rio');
      super.isTrue((_serviceProvider.password != confirmPassword), 'A senha e a confirma????o de senha est??o diferentes');
      _serviceProvider.password = md5(_serviceProvider.password);
    } else {
      delete _serviceProvider.password;
    }

    return super.save(_serviceProvider, request);

  }

  async createServiceProvider(request: Request) {
    let _serviceProvider = <ServiceProvider>request.body;
    let { confirmPassword } = request.body;

    this.validationDefault(_serviceProvider);
    super.isRequired(_serviceProvider.password, 'Informe sua senha');
    super.isRequired(confirmPassword, 'A confirma????o da senha ?? obrigat??rio');
    super.isTrue((_serviceProvider.password != confirmPassword), 'A senha e a confirma????o de senha est??o diferentes');

    if (_serviceProvider.photo) {
      let pictureCreatedResult = await FileHelper.writePicture(_serviceProvider.photo)
      if (pictureCreatedResult)
        _serviceProvider.photo = pictureCreatedResult
    }

    if (_serviceProvider.password)
      _serviceProvider.password = md5(_serviceProvider.password);

    return super.save(_serviceProvider, request, true);
  }

}