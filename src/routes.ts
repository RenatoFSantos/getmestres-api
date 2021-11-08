import { AddressController } from './controller/AddressController';
import { StorageController } from './controller/StorageController';
import { RequestOrderController } from './controller/RequestOrderController';
import { ServiceProviderController } from './controller/ServiceProviderController';
import { QuestionController } from './controller/QuestionController';
import { CategoryController } from './controller/CategoryController';
import { SubCategoryController } from './controller/SubCategoryController';
import { UserController } from "./controller/UserController";
import { CustomerController } from './controller/CustomerController';
import { RequestOrderAnswerController } from './controller/RequestOrderAnswerController';

export const Routes = [
    { method: "get", route: "/users", controller: UserController, action: "all" },
    { method: "get", route: "/users/:id", controller: UserController, action: "one" },
    { method: "post", route: "/users", controller: UserController, action: "save" },
    { method: "post", route: "/users/create", controller: UserController, action: "createUser" },
    { method: "post", route: "/users/auth", controller: UserController, action: "auth" },
    { method: "delete", route: "/users/:id", controller: UserController, action: "remove" },

    { method: "get", route: "/categories", controller: CategoryController, action: "all" },
    { method: "get", route: "/categories/:id", controller: CategoryController, action: "one" },
    { method: "get", route: "/categories/:id/subcategorys", controller: CategoryController, action: "getAllSubCategorys" },
    { method: "post", route: "/categories", controller: CategoryController, action: "save" },
    { method: "delete", route: "/categories/:id", controller: CategoryController, action: "remove" },

    { method: "get", route: "/subcategories", controller: SubCategoryController, action: "all" },
    { method: "get", route: "/subcategories/:id/questions", controller: SubCategoryController, action: "getAllQuestions" },
    { method: "get", route: "/subcategories/:id", controller: SubCategoryController, action: "one" },
    { method: "post", route: "/subcategories", controller: SubCategoryController, action: "save" },
    { method: "delete", route: "/subcategories/:id", controller: SubCategoryController, action: "remove" },

    { method: "get", route: "/questions", controller: QuestionController, action: "all" },
    { method: "get", route: "/questions/:id", controller: QuestionController, action: "one" },
    { method: "post", route: "/questions", controller: QuestionController, action: "save" },
    { method: "delete", route: "/questions/:id", controller: QuestionController, action: "remove" },

    { method: "get", route: "/customers", controller: CustomerController, action: "all" },
    { method: "get", route: "/customers/my/orders", controller: CustomerController, action: "getMyAllOrders" },
    { method: "get", route: "/customers/:id", controller: CustomerController, action: "one" },
    { method: "post", route: "/customers", controller: CustomerController, action: "save" },
    { method: "post", route: "/customers/auth", controller: CustomerController, action: "auth" },
    { method: "post", route: "/customers/create", controller: CustomerController, action: "createCustomer" },
    { method: "post", route: "/customers/changepassword", controller: CustomerController, action: "changePassword" },
    { method: "delete", route: "/customers/:id", controller: CustomerController, action: "remove" },

    { method: "get", route: "/services", controller: ServiceProviderController, action: "all" },
    { method: "get", route: "/services/orders/availables", controller: ServiceProviderController, action: "getAllOrderAvailable" },
    { method: "get", route: "/services/orders/my", controller: ServiceProviderController, action: "getMyOrders" },
    { method: "get", route: "/services/:id", controller: ServiceProviderController, action: "one" },
    { method: "post", route: "/services", controller: ServiceProviderController, action: "save" },
    { method: "post", route: "/services/auth", controller: ServiceProviderController, action: "auth" },
    { method: "post", route: "/services/create", controller: ServiceProviderController, action: "createServiceProvider" },
    { method: "delete", route: "/services/:id", controller: ServiceProviderController, action: "remove" },

    { method: "get", route: "/requests", controller: RequestOrderController, action: "all" },
    { method: "get", route: "/requests/:id", controller: RequestOrderController, action: "one" },
    { method: "post", route: "/requests", controller: RequestOrderController, action: "save" },
    { method: "put", route: "/requests/:id/accept", controller: RequestOrderController, action: "accept" },
    { method: "put", route: "/requests/:id/done", controller: RequestOrderController, action: "done" },
    { method: "delete", route: "/requests/:id", controller: RequestOrderController, action: "remove" },

    { method: "get", route: "/requestanswers/:orderUid/all", controller: RequestOrderAnswerController, action: "all" },
    { method: "post", route: "/requestanswers", controller: RequestOrderAnswerController, action: "save" },
    { method: "delete", route: "/requestanswers/:id", controller: RequestOrderAnswerController, action: "remove" },

    { method: "get", route: "/storage/:filename", controller: StorageController, action: "getFile" },

    { method: "get", route: "/address/", controller: AddressController, action: "getAllStates" },
    { method: "get", route: "/address/:state", controller: AddressController, action: "getAllCities" },

];