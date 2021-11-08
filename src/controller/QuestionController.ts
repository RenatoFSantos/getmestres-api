import { Question } from "../entity/Question";
import { BaseController } from "./BaseController";
import { Request } from 'express';
import { QuestionType } from "../entity/enum/QuestionType";

export class QuestionController extends BaseController<Question> {

  constructor() {
    super(Question);
  }

  async save(request: Request) {
    let _question = <Question>request.body;
    super.isRequired(_question.question, 'A pergunta é obrigatória.');
    super.isRequired(_question.type, 'O tipo da pergunta é obrigatório.');
    super.isRequired(_question.subCategory, 'A subcategoria é obrigatória.');

    let questionTypeInt = parseInt(_question.type.toString());
    if (questionTypeInt === QuestionType.Select) {
      super.isRequired(_question.options, 'Para o tipo SELECIONE você deve informar quais são as opções.');
    }
    return super.save(_question, request);
  }
}