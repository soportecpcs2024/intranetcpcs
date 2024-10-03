import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [units, setUnits] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorLocations, setErrorLocations] = useState(null);
  const [errorUnits, setErrorUnits] = useState(null);

  // Funciones de obtención de datos
  const fetchProducts = useCallback(async () => {
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
  }, []);

  const fetchLocations = useCallback(async () => {
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
  }, []);

  const fetchUnits = useCallback(async () => {
    setLoadingUnits(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/units`);
      setUnits(response.data);
    } catch (error) {
      console.error("Error fetching units", error);
      setErrorUnits(error);
    } finally {
      setLoadingUnits(false);
    }
  }, []);

  // Ejecutar las funciones de obtención de datos al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchLocations();
    fetchUnits();
  }, [fetchProducts, fetchLocations, fetchUnits]);

  // Funciones para CRUD
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error("Error creating product", error);
      setErrorProducts(error);
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      const updatedFormData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, updatedFormData);
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product._id === id ? response.data : product))
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

  const createUnits = async (unitData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/units`, unitData);
      await fetchUnits(); // Actualiza la lista de unidades después de crear una nueva
      return response.data;
    } catch (error) {
      console.error("Error creating unit", error);
      setErrorUnits(error);
      throw error;
    }
  };

  const updateUnit = async (id, unitData) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/units/${id}`, unitData);
      setUnits((prevUnits) =>
        prevUnits.map((unit) => (unit._id === id ? response.data : unit))
      );
    } catch (error) {
      console.error("Error updating unit", error);
      setErrorUnits(error);
    }
  };

  const removeUnit = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/units/${id}`);
      setUnits((prevUnits) => prevUnits.filter((unit) => unit._id !== id));
    } catch (error) {
      console.error("Error deleting unit", error);
      setErrorUnits(error);
    }
  };
  

  const createLocation = async (locationData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/location`, locationData);
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setLocations((prevLocations) => [...prevLocations, response.data]);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al crear la ubicación.';
      console.error("Error creating location", error);
      setErrorLocations(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateLocation = async (id, locationData) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/location/${id}`, locationData);
      setLocations((prevLocations) =>
        prevLocations.map((location) => (location._id === id ? response.data : location))
      );
    } catch (error) {
      console.error("Error updating location", error);
      setErrorLocations(error.response?.data?.error || error.message);
    }
  };

  const removeLocation = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/location/${id}`);
      setLocations((prevLocations) => prevLocations.filter((location) => location._id !== id));
    } catch (error) {
      console.error("Error deleting location", error);
      setErrorLocations(error.response?.data?.error || error.message);
    }
  };
  

  return (
    <ProductContext.Provider
      value={{
        products,
        locations,
        units,
        loadingProducts,
        loadingLocations,
        loadingUnits,
        errorProducts,
        errorLocations,
        errorUnits,
        fetchProducts,
        fetchLocations,
        fetchUnits,
        createProduct,
        updateProduct,
        removeProduct,
        createUnits,
        updateUnit,
        removeUnit,
        createLocation,
        updateLocation,
        removeLocation
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
