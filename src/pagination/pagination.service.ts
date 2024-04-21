import { Inject, Injectable } from '@nestjs/common';
import { count } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../db/schema';

@Injectable()
export class PaginationService {
  constructor(@Inject('DB_DEV') private databaseService: MySql2Database<typeof schema>) {}

  async paginate(req, builder, model, options, relations, currentPage, limit, columns, search){
    console.log('Inside Pagination Service paginate');

    const offset = (currentPage - 1) * limit

    options = {
      ...options,
      columns: columns,
      with: relations,
      limit: limit,
      offset: offset,
    }

    // console.log(options);
  
    // GET RELATIONS ??
    // if(options.relations && options.relations.length){
    //   query = query.populate(options.relations)
    // }

    let data = await builder.findMany(options)
    const pageDataCount = data.length
    let totalDataCountTemp
    if(options?.where?.length > 0){
      totalDataCountTemp = await this.databaseService.select({ count: count() }).from(model).where(options?.where)
    }
    else{
      totalDataCountTemp = await this.databaseService.select({ count: count() }).from(model)
    }
    const totalDataCount = totalDataCountTemp[0].count
    const totalPages = Math.ceil(totalDataCountTemp[0].count/limit)
    const next = currentPage < totalPages ? `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}${req.path.substring(0, req.path - 1)}?currentPage=${(parseInt(currentPage)+1)}&limit=${limit}&search=${search}` : null
    const previous = (currentPage > 1 && currentPage <= totalPages) ? `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}${req.path.substring(0, req.path - 1)}?page=${(parseInt(currentPage)-1)}&limit=${limit}&search=${search}` : null

    return {
      data,
      pageDataCount,
      totalDataCount,
      totalPages,
      next,
      previous
    }
  }
}
