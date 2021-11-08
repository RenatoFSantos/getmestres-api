import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getRepository, Repository } from 'typeorm';
import config from './../configuration/config';

export default async (req: Request, res: Response, next: Function) => {
  let token = req.body.token || req.query.token || req.headers['x-token-access'];
  let publicRoutes = <Array<String>>config.publicRoutes;
  let isPublicRoute: boolean = false;

  // Identificando se a rota é publica
  publicRoutes.forEach(url => {
    let isPublic = req.url.includes(url) || req.url.indexOf('storage') > -1;
    if (isPublic) {
      isPublicRoute = true;
    }
  });

  // Se existir uma rota pública seguir em frente sem passar pelo token
  if (isPublicRoute) {
    next()
  } else {
    if (token) {
      try {
        // --- Coloquei um parse no token por motivos do token vir com aspas e gerar um erro na verificação.
        const _userAuth = verify(JSON.parse(token), config.secretKey);
        req.userAuth = _userAuth;

        // Identificando se usuário é um administrador e inserindo valor na requisição
        const _userRepository: Repository<any> = getRepository(_userAuth.origin);
        const _userDB = await _userRepository.findOne({
          where: {
            uid: _userAuth.uid
          }
        })
        req.IsRoot = _userDB.isRoot || false;

        next();
      } catch (error) {
        res.status(401).send({ message: 'Token informado é inválido' });
        return;
      }
    } else {
      res.status(401).send({ message: 'Para acessar esse recurso você precisa estar autenticado.' });
      return;
    }
  }
}

