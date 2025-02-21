import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '分类名称不能为空'],
    unique: true,
    trim: true,
    maxlength: [50, '分类名称不能超过50个字符']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [200, '分类描述不能超过200个字符']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 虚拟字段：子分类
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// 虚拟字段：文章数量
categorySchema.virtual('articleCount', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// 创建slug中间件
categorySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category; 