import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../db/schema';

@Injectable()
export class PaginationService {
  constructor( @Inject('DB_DEV') private readonly databaseService: MySql2Database<typeof schema>) {}

  async paginate(model, limit, offset){ //: validateJWTUserDTO
    console.log('Inside Pagination Service paginate');

    const data = await model.findMany({
                        columns: {
                          id: true,
                          name: true,
                          email: true,
                          created_at: true
                        },
                        limit: limit,
                        offset: offset
                      });

    console.log(data);

    return data
  }
}
