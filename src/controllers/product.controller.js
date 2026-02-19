import ProductModel from "../models/product.model.js";


// 🔥 CREATE PRODUCT (ADMIN ONLY)
export const createProduct = async (req, res) => {
  try {
    const product = await ProductModel.create({
      ...req.body,
      vendor: req.user._id,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📦 GET ALL PRODUCTS (Public)
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("createdBy", "email fullname");

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔍 GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✏ UPDATE PRODUCT (ADMIN ONLY)
export const updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ DELETE PRODUCT (ADMIN ONLY)
export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
