import { Inject, Injectable } from '@nestjs/common';
import { count } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../db/schema';

@Injectable()
export class PaginationService {
  constructor(@Inject('DB_DEV') private databaseService: MySql2Database<typeof schema>) {}

  async paginate(req, builder, model, options, currentPage, limit, columns, search){
    console.log('Inside Pagination Service paginate');

    const offset = (currentPage - 1) * limit

    options = {
      ...options,
      columns: columns,
      limit: limit,
      offset: offset
    }
  
    // GET RELATIONS ??
    // if(options.relations && options.relations.length){
    //   query = query.populate(options.relations)
    // }

    const data = await builder.findMany(options)
    const pageDataCount = data.length
    const totalDataCountTemp = await this.databaseService.select({ count: count() }).from(model).where(options.where)
    const totalDataCount = totalDataCountTemp[0].count
    const totalPages = Math.ceil(totalDataCountTemp[0].count/limit)
    const next = currentPage < totalPages ? `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}${req.path.substring(0, req.path - 1)}?currentPage=${(parseInt(currentPage)+1)}&limit=${limit}&search=${search}` : null
    const previous = (currentPage > 1 && currentPage <= totalPages) ? `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}${req.path.substring(0, req.path - 1)}?page=${(parseInt(currentPage)-1)}&limit=${limit}&search=${search}` : null

    console.log(      
      pageDataCount,
      totalDataCount,
      totalPages,
      next,
      previous,
      data,
    );

    return {
      data,
      pageDataCount,
      totalDataCount,
      totalPages,
      next,
      previous
    }
  }

  async paginate2(req, model, where, currentPage, limit, select, search){
    console.log('Inside Pagination Service paginate');

    const offset = (currentPage - 1) * limit
  
    // GET RELATIONS ??
    // if(options.relations && options.relations.length){
    //   query = query.populate(options.relations)
    // }

    const data = await this.databaseService
                  .select(select)
                  .from(model)
                  .where(where)
                  .limit(limit)
                  .offset(offset);

    // const data = await builder.findMany(options)
    const pageDataCount = data.length
    const totalDataCountTemp = await this.databaseService.select({ count: count() }).from(model).where(where)
    const totalDataCount = totalDataCountTemp[0].count
    const totalPages = Math.ceil(totalDataCountTemp[0].count/limit)
    const next = currentPage < totalPages ? `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}${req.path.substring(0, req.path - 1)}?currentPage=${(parseInt(currentPage)+1)}&limit=${limit}&search=${search}` : null
    const previous = (currentPage > 1 && currentPage <= totalPages) ? `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}${req.path.substring(0, req.path - 1)}?page=${(parseInt(currentPage)-1)}&limit=${limit}&search=${search}` : null

    console.log(      
      pageDataCount,
      totalDataCount,
      totalPages,
      next,
      previous,
      data,
    );

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
