import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RejectedArticleService } from './rejected.service';
import { CreateRejectedDto } from './create-rejected-article.dto';
import { error } from 'console';
@Controller('api/rejected')
export class RejectedArticleController {
  constructor(private readonly subArticleService: RejectedArticleService) {}
  @Get('/test')
  test() {
    return this.subArticleService.test();
  } // Get all articles
  @Get('/')
  async findAll() {
    try {
      return this.subArticleService.findAll();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
  // Get one rejected article via id
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.subArticleService.findOne(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Article found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
  // Create/add a article
  @Post('/')
  async addRejected(@Body() createRejectedDto: CreateRejectedDto) {
    try {
      await this.subArticleService.create(createRejectedDto);
      return { message: 'Rejected article added successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to add this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
  // Update an article
  @Put('/:id')
  async updateRejected(
    @Param('id') id: string,
    @Body() createRejectedDto: CreateRejectedDto,
  ) {
    try {
      await this.subArticleService.update(id, createRejectedDto);
      return { message: 'Rejected article updated successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to update this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
  // Delete an article via id
  @Delete('/:id')
  async deleteRejected(@Param('id') id: string) {
    try {
      return await await this.subArticleService.deleteRejected(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No such a article',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
