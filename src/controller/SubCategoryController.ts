import { getRepository } from 'typeorm';
import { SubCategory } from "../entity/SubCategory";
import { BaseController } from "./BaseController";
import { Request } from 'express';
import { Question } from '../entity/Question';

export class SubCategoryController extends BaseController<SubCategory> {

  private _questionRepository = getRepository(Question);

  constructor() {
    super(SubCategory);
  }

  async save(request: Request) {
    let _subCategory = <SubCategory>request.body;
    super.isRequired(_subCategory.name, 'Nome é obrigatório!');
    super.isRequired(_subCategory.category, 'Categoria é obrigatória.');
    super.isRequired(_subCategory.cost, 'O custo é obrigatório.');
    super.isTrue(isNaN(_subCategory.cost), 'O custo deve ser numérico.');
    super.isTrue(_subCategory.cost <= 0, 'O custo deve ser maior que 0(zero).');
    return super.save(_subCategory, request);
  }

  async getAllQuestions(request: Request) {
    const { id: categoryId } = request.params;
    return this._questionRepository.find({
      where: {
        subCategory: categoryId,
        active: true,
        deleted: false
      }
    })
  }
}