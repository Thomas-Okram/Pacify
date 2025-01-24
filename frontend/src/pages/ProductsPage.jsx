import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const ProductPage = ({ isAdmin }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error(error);
        setError("Error fetching products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle input change for the add product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change for the product image
  const handleFileChange = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Add a new product
  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("image", newProduct.image);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts((prev) => [...prev, response.data.product]);
      setNewProduct({ name: "", description: "", price: "", image: null });
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Error adding product");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white">
      <section className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
          Product List
        </h2>
        {isLoading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-green-400 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-300 text-sm">{product.description}</p>
              <p className="text-gray-400 mt-2">Price: ₹{product.price}</p>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {isAdmin && (
        <section className="py-20 px-10 bg-gray-900">
          <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
            Add New Product
          </h2>
          <div className="max-w-lg mx-auto">
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              placeholder="Product Description"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Product Price"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <button
              onClick={handleAddProduct}
              className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              Add Product
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

ProductPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default ProductPage;
