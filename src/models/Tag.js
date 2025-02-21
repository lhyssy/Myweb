import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '标签名称不能为空'],
    unique: true,
    trim: true,
    maxlength: [30, '标签名称不能超过30个字符']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [100, '标签描述不能超过100个字符']
  },
  color: {
    type: String,
    default: '#666666'
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

// 虚拟字段：文章数量
tagSchema.virtual('articleCount', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'tags',
  count: true
});

// 创建slug中间件
tagSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
  next();
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag; 