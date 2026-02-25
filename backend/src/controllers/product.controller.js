import ProductModel from "../models/product.model.js";
import uploadFile from "../services/storage.service.js";

// CREATE PRODUCT  ImageKit upload
export const createProduct = async (req, res) => {
  try {
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadFile(file, "products"); 
        imageUrls.push(uploaded.url);
      }
    }

    const product = await ProductModel.create({
      ...req.body,
      images: imageUrls,
      vendor: req.user._id,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error.stack);
    res.status(500).json({ message: error.message });
  }
};

// 📦 GET ALL PRODUCTS (Public)
export const getAllProducts = async (req, res) => {
  try {
    const { category, city } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (city) filter.city = city;

    const products = await ProductModel.find(filter)
      .populate("vendor", "fullname email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
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

// ✏ UPDATE PRODUCT (ADMIN + VENDOR ONLY) – with optional image update
export const updateProduct = async (req, res) => {
  try {
    const existingProduct = await ProductModel.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imageUrls = req.body.images || existingProduct.images || [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadFile(file, "products");
        imageUrls.push(uploaded.url);
      }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: imageUrls },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error.stack);
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE PRODUCT (ADMIN + VENDOR ONLY)
export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error.stack);
    res.status(500).json({ message: error.message });
  }
};