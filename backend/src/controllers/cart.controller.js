import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Rental from "../models/rental.model.js";

/* ---------------- ADD TO CART ---------------- */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- CHECKOUT ---------------- */
export const checkout = async (req, res) => {
  try {
    const { tenure } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const createdRentals = [];

    for (let item of cart.items) {
      const product = item.product;

      if (!product.tenureOptions.includes(tenure)) {
        return res.status(400).json({
          message: `Invalid tenure for ${product.name}`,
        });
      }

      if (product.availableStock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      for (let i = 0; i < item.quantity; i++) {
        const totalAmount =
          product.monthlyRent * tenure + product.securityDeposit;

        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + tenure);

        const rental = await Rental.create({
          user: req.user.id,
          product: product._id,
          tenure,
          endDate,
          totalAmount,
        });

        createdRentals.push(rental);
      }

      product.availableStock -= item.quantity;
      await product.save();
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Checkout successful",
      rentalsCreated: createdRentals.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ---------------- GET CART ---------------- */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- REMOVE ITEM ---------------- */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- CLEAR CART ---------------- */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
