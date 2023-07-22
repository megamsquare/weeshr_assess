import { body, ValidationChain } from 'express-validator';

export interface CreateBlog {
    title: string;
    content: string;
    author: string;
}

export interface IsBlogOwner {
    blogId: string;
    userId: string;
}

export interface UpdateBlog {
    title: string;
    content: string;
    author: string;
    blogId: string;
}

export interface QueryBlog {
    pageNumber: number;
    limitNumber: number;
}

export const validateBlog: ValidationChain[] = [
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
    body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
    body('author').trim().isLength({ min: 1 }).withMessage('Author is required'),
  ];