import { Request, Response } from "express";
import {
  CreateBlog,
  IsBlogOwner,
  QueryBlog,
  UpdateBlog,
} from "../dto/obj/blog.dto";
import Services from "../services";
import status_code from "http-status";
import { UserRequest } from "../dto/obj/user.dto";

async function create(req: Request, res: Response) {
  try {
    const newBlog: CreateBlog = req.body;

    const savedBlog = await Services.BlogService.createBlog(newBlog);
    if (savedBlog instanceof Error) {
      res.status(status_code.BAD_REQUEST).json({ error: savedBlog });
      return;
    }

    res.status(status_code.CREATED).json({ data: savedBlog });
  } catch (error) {
    res.status(status_code.UNAUTHORIZED).json({ error });
  }
}

async function update(req: UserRequest, res: Response) {
  try {
    if (!req.params.id || req.params.id == "") {
      res.status(status_code.BAD_REQUEST).json({ error: 'Invalid postId' });
      return;
    }
    const isBlogOwner: IsBlogOwner = {
      userId: req.user?.userId as string,
      blogId: req.params.id,
    };

    const isOwner = await Services.BlogService.isOwner(isBlogOwner);
    if (isOwner instanceof Error) {
      return res.status(status_code.BAD_REQUEST).json({ error: isOwner });
    }

    if (!isOwner) {
      return res
        .status(status_code.UNAUTHORIZED)
        .json({
          error: "Unauthorized: You are not the author of this blog post",
        });
    }

    const updateBlog: UpdateBlog = req.body;
    updateBlog.blogId = req.params.id;

    const updatedBlog = Services.BlogService.updateBlog(updateBlog);
    if (updatedBlog instanceof Error) {
      return res.status(status_code.BAD_REQUEST).json({ error: updatedBlog });
    }

    res.status(status_code.OK).json({ data: updatedBlog });
  } catch (error) {
    return res.status(status_code.UNAUTHORIZED).json({ error });
  }
}

async function getById(req: Request, res: Response) {
  try {
    if (!req.params.id || req.params.id == "") {
      res.status(status_code.BAD_REQUEST).json({ error: 'Invalid postId' });
      return;
    }

    const getBlog = await Services.BlogService.getBlogById(req.params.id);
    if (getBlog instanceof Error) {
      res.status(status_code.BAD_REQUEST).json({ error: getBlog });
      return;
    }

    res.status(status_code.OK).json({ data: getBlog });
  } catch (error) {
    res.status(status_code.UNAUTHORIZED).json({ error });
  }
}

async function getAll(req: Request, res: Response) {
  try {
    const { page = 1, items = 10 } = req.query;
    const pageLimit: QueryBlog = {
      pageNumber: page as number,
      limitNumber: items as number,
    };
    const blogs = await Services.BlogService.getAllBlog(pageLimit);
    if (blogs instanceof Error) {
      res.status(status_code.BAD_REQUEST).json({ error: blogs });
      return;
    }
    res.status(status_code.OK).json({ data: blogs });
  } catch (error) {
    res.status(status_code.UNAUTHORIZED).json({ error });
  }
}

async function deleteById(req: UserRequest, res: Response) {
  try {
    if (!req.params.id || req.params.id == "") {
      res.status(status_code.BAD_REQUEST).json({ error: 'Invalid postId' });
      return;
    }
    const isBlogOwner: IsBlogOwner = {
      userId: req.user?.userId as string,
      blogId: req.params.id,
    };

    const isOwner = await Services.BlogService.isOwner(isBlogOwner);
    if (isOwner instanceof Error) {
      return res.status(status_code.BAD_REQUEST).json({ error: isOwner });
    }

    if (!isOwner) {
      return res
        .status(status_code.UNAUTHORIZED)
        .json({
          error: "Unauthorized: You are not the author of this blog post",
        });
    }
    const deletedBlogId = await Services.BlogService.deleteBlog(req.params.id);
    if (deletedBlogId instanceof Error) {
      res.status(status_code.BAD_REQUEST).json({ error: deletedBlogId });
      return;
    }

    res.status(status_code.OK).json({ data: deletedBlogId });
  } catch (error) {
    res.status(status_code.UNAUTHORIZED).json({ error });
  }
}

const BlogController = {
  create,
  update,
  getAll,
  getById,
  deleteById,
};

export default BlogController;
