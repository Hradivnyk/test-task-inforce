import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Book name is required'],
      trim: true,
      minlength: [1, 'Name must be at least 1 character'],
      maxlength: [200, 'Name must be at most 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      minlength: [2, 'Author must be at least 2 characters'],
      maxlength: [100, 'Author must be at most 100 characters'],
    },
    pageCount: {
      type: Number,
      required: [true, 'Page count is required'],
      min: [1, 'Page count must be at least 1'],
    },
  },
  {
    timestamps: true,
  },
);

// Remove __v from the response
bookSchema.methods.toJSON = function () {
  const book = this.toObject();
  delete book.__v;
  return book;
};

const Book = mongoose.model('Book', bookSchema);

export default Book;
