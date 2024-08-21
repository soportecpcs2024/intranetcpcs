import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]); // Estado para las ubicaciones
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorLocations, setErrorLocations] = useState(null);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      setProducts(response.data);
       
    } catch (error) {
      console.error("Error fetching products", error);
      setErrorProducts(error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/location`);
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations", error);
      setErrorLocations(error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(productData)) {
        if (key === 'image' && value) {
          formData.append('image', value);
        } else {
          formData.append(key, value);
        }
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error("Error creating product", error);
      setErrorProducts(error);
    }
  };

  const getProductById = (id) => {
    return products.find((product) => product._id === id);
  };

  const updateProduct = async (id, formData) => {
    try {
      const updatedFormData = {
        ...formData,
        price: parseFloat(formData.price), // Convertir a número
        quantity: parseInt(formData.quantity, 10) // Convertir a número si es necesario
      };
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
        updatedFormData
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? response.data : product
        )
      );
    } catch (error) {
      console.error("Error updating product", error);
      setErrorProducts(error);
    }
  };

  const removeProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product", error);
      setErrorProducts(error);
    }
  };

  const createUnits = async (unitsData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/units`, unitsData);
      console.log('Units created:', response.data);
    } catch (error) {
      console.error("Error creating units", error);
      setErrorProducts(error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        locations,
        loadingProducts,
        loadingLocations,
        errorProducts,
        errorLocations,
        getProductById,
        fetchProducts,
        fetchLocations,
        updateProduct,
        createProduct,
        removeProduct,
        createUnits
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
