import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { DeepPartial, DeleteResult, FindOptionsRelations, FindOptionsWhere, Not, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SoftDeleteResult } from '../utils/types/delete-result.type';
import { NullableType } from '@NibrasoftNet/linkbook-commons';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}
  async create(data: DeepPartial<Session>): Promise<Session> {
    return this.sessionRepository.save(this.sessionRepository.create(data));
  }

  async findOne(fields: FindOptionsWhere<User>, relations?: FindOptionsRelations<User>): Promise<NullableType<Session>> {
    return this.sessionRepository.findOne({
      where: fields,
      relations: relations
    });
  }

  async softDelete({excludeId, ...criteria}: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<SoftDeleteResult> {
    return await this.sessionRepository.softDelete({
      ...criteria,
      id: criteria.id ? criteria.id : excludeId ? Not(excludeId) : undefined,
    });
  }
}
