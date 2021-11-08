import { RequestOrder } from "../entity/RequestOrder";
import { BaseController } from "./BaseController";
import { Request, Response } from 'express';
import { RequestStatus } from "../entity/enum/RequestStatus";
import { Customer } from "../entity/Customer";
import { ServiceProvider } from "../entity/ServiceProvider";

export class RequestOrderController extends BaseController<RequestOrder> {
  constructor() {
    super(RequestOrder, false);
  }

  async save(request: Request) {
    const _requestOrder = <RequestOrder>request.body;
    // Buscando as informações do usuário atual
    _requestOrder.customer = new Customer();
    _requestOrder.customer.uid = request.UserAuth.uid;

    super.isRequired(_requestOrder.title, 'Informe o título do seu pedido.');
    super.isRequired(_requestOrder.description, 'Informe sua necessidade.');
    // super.isRequired(_requestOrder.customer, 'Preciso saber quem é você.');
    super.isRequired(_requestOrder.longlat, 'Preciso saber onde você está.');
    super.isRequired(_requestOrder.subCategory, 'Informe a subcategoria!');
    super.isRequired(_requestOrder.statusOrder, 'Necessário definir um status.');

    if (!_requestOrder.uid) {
      _requestOrder.statusOrder = RequestStatus.Pending;
    }

    return super.save(_requestOrder, request);

  }

  async accept(request: Request) {
    const uid = request.params.id as string;
    const order = await this.repository.findOne(uid);
    if (!order) {
      return {
        status: 404,
        errors: [
          'Solicitação não foi encontrada!'
        ]
      }
    } else {
      order.serviceProvider = new ServiceProvider();
      order.serviceProvider.uid = request.userAuth.uid;
      order.statusOrder = RequestStatus.Accepted;
      await this.repository.save(order);
      return {
        message: [
          'Solicitação aceita com sucesso!'
        ]
      }
    }
  }

  async done(request: Request) {
    const uid = request.params.id as string;
    const order = await this.repository.findOne(uid);
    if (!order) {
      return {
        status: 404,
        errors: [
          'Solicitação não foi encontrada!'
        ]
      }
    } else {
      order.statusOrder = RequestStatus.Finished;
      await this.repository.save(order);
      return {
        message: [
          'Solicitação finalizada com sucesso!'
        ]
      }
    }
  }
}