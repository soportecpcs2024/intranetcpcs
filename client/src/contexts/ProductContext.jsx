import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const formData = new FormData();
      
      // Añadir campos del producto a FormData
      for (const [key, value] of Object.entries(productData)) {
        if (key === 'image' && value) {
          formData.append('image', value); // Añadir el archivo directamente
        } else {
          formData.append(key, value);
        }
      }
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error("Error creating product", error);
      setError(error);
    }
  };

  const getProductById = (id) => {
    return products.find((product) => product._id === id);
  };

  const updateProduct = async (id, formData) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
        formData
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? response.data : product
        )
      );
    } catch (error) {
      console.error("Error updating product", error);
      setError(error);
    }
  };

  const removeProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product", error);
      setError(error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        getProductById,
        fetchProducts,
        updateProduct,
        createProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
