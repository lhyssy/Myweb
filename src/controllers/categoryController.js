import { validationResult } from 'express-validator';
import Category from '../models/Category.js';

// 创建分类
export const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, parent } = req.body;
    const category = await Category.create({
      name,
      description,
      parent: parent || null
    });

    res.status(201).json({
      message: '分类创建成功',
      category
    });
  } catch (error) {
    console.error('创建分类错误:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: '该分类名称已存在' });
    }
    res.status(500).json({ message: '创建分类时发生错误' });
  }
};

// 获取所有分类
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parent', 'name')
      .populate('children')
      .populate('articleCount');

    // 构建分类树
    const buildCategoryTree = (categories, parentId = null) => {
      return categories
        .filter(category => category.parent?._id?.toString() === parentId?.toString())
        .map(category => ({
          ...category.toObject(),
          children: buildCategoryTree(categories, category._id)
        }));
    };

    const categoryTree = buildCategoryTree(categories);

    res.json({
      categories: categoryTree
    });
  } catch (error) {
    console.error('获取分类列表错误:', error);
    res.status(500).json({ message: '获取分类列表时发生错误' });
  }
};

// 获取单个分类
export const getCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug })
      .populate('parent', 'name slug')
      .populate('children', 'name slug')
      .populate('articleCount');

    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    res.json({ category });
  } catch (error) {
    console.error('获取分类详情错误:', error);
    res.status(500).json({ message: '获取分类详情时发生错误' });
  }
};

// 更新分类
export const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, parent } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    // 检查是否将分类设为自己的子分类
    if (parent && parent === id) {
      return res.status(400).json({ message: '不能将分类设为自己的子分类' });
    }

    // 检查是否将分类设为其子分类的子分类
    if (parent) {
      const children = await Category.find({ parent: id });
      if (children.some(child => child._id.toString() === parent)) {
        return res.status(400).json({ message: '不能将分类设为其子分类的子分类' });
      }
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.parent = parent || null;

    await category.save();

    res.json({
      message: '分类更新成功',
      category
    });
  } catch (error) {
    console.error('更新分类错误:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: '该分类名称已存在' });
    }
    res.status(500).json({ message: '更新分类时发生错误' });
  }
};

// 删除分类
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查是否存在子分类
    const hasChildren = await Category.exists({ parent: id });
    if (hasChildren) {
      return res.status(400).json({ message: '请先删除或移动该分类下的子分类' });
    }

    // 检查是否有文章使用该分类
    const hasArticles = await Category.findById(id).populate('articleCount');
    if (hasArticles && hasArticles.articleCount > 0) {
      return res.status(400).json({ message: '请先移除或更改使用该分类的文章' });
    }

    await Category.findByIdAndDelete(id);

    res.json({ message: '分类删除成功' });
  } catch (error) {
    console.error('删除分类错误:', error);
    res.status(500).json({ message: '删除分类时发生错误' });
  }
}; 