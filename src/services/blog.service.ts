import Model from "../models";
import Err from "../dto/error_dto";
import {
  CreateBlog,
  IsBlogOwner,
  QueryBlog,
  UpdateBlog,
} from "../dto/obj/blog.dto";

async function isOwner(isBlogOwner: IsBlogOwner) {
  try {
    const blogModel = Model.Blog;
    const blog = await blogModel.findById(isBlogOwner.blogId);
    if (!blog) {
        throw new Error("Blog does not exist");
    }

    if (blog.author !== isBlogOwner.userId) {
        return false;
    }

    return true;
  } catch (error) {
    return error as Error;
  }
}

async function createBlog(blogInfo: CreateBlog) {
  try {
    const blogModel = Model.Blog;
    const newBlog = await blogModel.create({ ...blogInfo });

    return newBlog;
  } catch (error) {
    return error as Error;
  }
}

async function updateBlog(blogInfo: UpdateBlog) {
  try {
    const blogModel = Model.Blog;

    const update = {
      title: blogInfo.title,
      content: blogInfo.content,
      author: blogInfo.author,
    };

    const updatedBlog = await blogModel.findByIdAndUpdate(
      { _id: blogInfo.blogId },
      update,
      { new: true }
    );

    if (!updatedBlog) {
      throw new Error("Blog Post not found");
    }

    return updatedBlog;
  } catch (error) {
    return error as Error;
  }
}

async function getBlogById(blogId: string) {
  try {
    const blogModel = Model.Blog;
    const blog = await blogModel.findOne({ _id: blogId });

    if (!blog) {
      throw new Error("Blog Post not found");
    }

    return blog;
  } catch (error) {
    console.log(error)
    return error as Error;
  }
}

async function getAllBlog(query: QueryBlog) {
  try {
    const blogModel = Model.Blog;
    const skip = (query.pageNumber - 1) * query.limitNumber;
    const blogs = await blogModel.find().skip(skip).limit(query.limitNumber);

    return blogs;
  } catch (error) {
    return error as Error;
  }
}

async function deleteBlog(blogId: string) {
  try {
    const blogModel = Model.Blog;
    const deletedBlog = await blogModel.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      throw new Error("Blog post Not Found");
    }

    return deletedBlog;
  } catch (error) {
    return error as Error;
  }
}

const BlogService = {
  createBlog,
  updateBlog,
  getBlogById,
  getAllBlog,
  deleteBlog,
  isOwner
};

export default BlogService;
