import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorLocations, setErrorLocations] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      setErrorProducts(error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    setLoadingLocations(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/location`
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations", error);
      setErrorLocations(error);
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchLocations();
  }, [fetchProducts, fetchLocations]);

  const createProduct = async (productData) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(productData)) {
        if (key === "image" && value) {
          formData.append("image", value);
        } else {
          formData.append(key, value);
        }
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
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
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Error deleting product", error);
      setErrorProducts(error);
    }
  };

  const createUnits = async (unitsData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/units`,
        unitsData
      );
      console.log("Units created:", response.data);
    } catch (error) {
      console.error("Error creating units", error);
      setErrorProducts(error);
    }
  };

  const createLocation = async (locationData) => {
    try {
      // Envía la solicitud POST a la API con los datos de la ubicación
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/location`,
        locationData
      );
  
      // Actualiza el estado de las ubicaciones con la nueva ubicación creada
      setLocations((prevLocations) => [...prevLocations, response.data]);
    } catch (error) {
      console.error("Error creating location", error);
      setErrorLocations(error);
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
        createUnits,
        createLocation
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
