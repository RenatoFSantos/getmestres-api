import { SubCategory } from './../entity/SubCategory';
import { getRepository } from 'typeorm';
import { Category } from "../entity/Category";
import { BaseController } from "./BaseController";
import { Request } from "express";

export class CategoryController extends BaseController<Category> {

  private _subCategoryRepository = getRepository(SubCategory)

  constructor() {
    super(Category);

  }

  async save(request: Request) {
    let _category = <Category>request.body;
    super.isRequired(_category.name, "Nome é obrigatório");
    return super.save(_category, request);
  }

  async all(request: Request) {
    // Validando se usuário sem ser ROOT
    return this.repository.find({
      where: {
        deleted: false
      }
    });
  }

  getAllSubCategorys(request: Request) {
    const { id: categoryId } = request.params;
    return this._subCategoryRepository.find({
      where: {
        category: categoryId,
        deleted: false
      }
    })
  }
}