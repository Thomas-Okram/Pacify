import { Product } from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, mrp, vp, variants } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      description,
      mrp,
      vp,
      variants: variants ? JSON.parse(variants) : [],
    });

    product.variants[0].images = [imageUrl];
    await product.save();

    res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
