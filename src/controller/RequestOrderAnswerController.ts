import { RequestOrderAnswer } from './../entity/RequestOrderAnswer';
import { BaseController } from "./BaseController";
import { Request } from 'express';
import { SimpleConsoleLogger } from 'typeorm';

export class RequestOrderAnswerController extends BaseController<RequestOrderAnswer> {
  constructor() {
    super(RequestOrderAnswer, false);
  }

  async all(request: Request) {
    let { orderUid } = request.params;
    console.log('q', orderUid);

    if (!orderUid) {
      return { status: 400, message: 'Informe o código da requisição.' }
    }

    return this.repository.find({
      select: ['uid', 'answer'],
      where: {
        requestOrder: orderUid
      },
      relations: ['question']
    })

  }

  async save(request: Request) {
    let _requestOrderAnswer = <RequestOrderAnswer>request.body;
    super.isRequired(_requestOrderAnswer.answer, 'Informe a resposta da pergunta.');
    super.isRequired(_requestOrderAnswer.question, 'A questão precisa ser informada.');
    super.isRequired(_requestOrderAnswer.requestOrder, 'Informe a requisição.');

    return super.save(_requestOrderAnswer, request);
  }

}