import { Document, Schema, model } from "mongoose";
import { IUser } from "./users.model";


export interface IBlog extends Document {
    title: string;
    content: string;
    author: IUser['_id']
}

const BlogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: [true, 'Please provide blog title']
    },
    content: {
        type: String,
        required: [true, 'Please provide blog content']
    },
    author: {
        type : Schema.Types.ObjectId,
        ref:'users',
        required:[ true,'Author is mandatory' ]
    }
},
{
    timestamps: true
});

const Blog = model<IBlog>(
    'blogs',
    BlogSchema
);

export default Blog;