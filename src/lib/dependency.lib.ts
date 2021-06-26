import UserRepository from "repository/user.repository";
import UserService from "service/user.service";
import { Container } from "typedi";
import { getCustomRepository } from "typeorm";

interface IModels {
  name: string;
  model: any;
}

interface IRepository {
  name: string;
  repo: any;
}

interface IService {
  name: string;
  service: any;
}

export default class DependencyLib {
  private services: IService[];
  private repositories: IRepository[];

  inject() {
    //this.dependencyRepository();
    this.dependencyService();
  }

  dependencyService = () => {
    const services: IService[] = [
      {
        name: "user.service",
        service: UserService,
      },
    ];

    services.forEach((service) => {
      Container.set(service.name, service.service);
    });
  };

  dependencyRepository = () => {
    const repositories: IRepository[] = [
      {
        name: "user.repository",
        repo: UserRepository,
      },
    ];

    repositories.forEach((repo) => {
      Container.set(repo.name, getCustomRepository(repo.repo));
    });
  };
}
