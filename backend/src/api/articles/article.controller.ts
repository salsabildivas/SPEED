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
import { ArticleService, SubmittedArticleService} from './article.service';
import { CreateSubmittedDto } from './create-submitted-article.dto';
import { error } from 'console';
import { CreateArticleDto } from './create-published-article.dto';
@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get('/test')
  test() {
    return this.articleService.test();
  } // Get all articles
  @Get('/')
  async findAll() {
    try {
      return this.articleService.findAll();
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
  // Get one book via id
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.articleService.findOne(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Book found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
  // Create/add a book
  @Post('/')
  async addBook(@Body() createArticleDto: CreateArticleDto) {
    try {
      await this.articleService.create(createArticleDto);
      return { message: 'Book added successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to add this book',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
  // Update a book
  @Put('/:id')
  async updateBook(
    @Param('id') id: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    try {
      await this.articleService.update(id, createArticleDto);
      return { message: 'Book updated successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to update this book',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
  // Delete a book via id
  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    try {
      return await await this.articleService.deleteArticle(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No such a book',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}

@Controller('api/articles')
export class SubmittedArticleController {
  constructor(private readonly subArticleService: SubmittedArticleService) {}
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
  // Get one book via id
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.subArticleService.findOne(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Book found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
  // Create/add a article
  @Post('/')
  async addSubmitted(@Body() createSubmittedDto: CreateSubmittedDto) {
    try {
      await this.subArticleService.create(createSubmittedDto);
      return { message: 'Article added successfully' };
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
  async updateSubmitted(
    @Param('id') id: string,
    @Body() createSubmittedDto: CreateSubmittedDto,
  ) {
    try {
      await this.subArticleService.update(id, createSubmittedDto);
      return { message: 'Article updated successfully' };
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
  async deleteSubmitted(@Param('id') id: string) {
    try {
      return await await this.subArticleService.deleteSubmitted(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No such a book',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
