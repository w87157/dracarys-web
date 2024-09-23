import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth'

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [favoritesWithDetails, setFavoritesWithDetails] = useState([]);
  const { auth } = useAuth()

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8080/shop/favorites', {
        params: { login: auth.login }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/shop/p-list');
      return response.data.result;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const combineFavoritesWithProducts = (favorites, products) => {
    const productMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    return favorites.map(fav => ({
      ...fav,
      productDetails: productMap[fav.fk_product_id]
    })).filter(fav => fav.productDetails); // Ensure the product exists
  };

  useEffect(() => {
    const fetchAndCombineData = async () => {
      if (auth.login) {
        const [favs, prods] = await Promise.all([fetchFavorites(), fetchProducts()]);
        setFavorites(favs);
        setProducts(prods);
        setFavoritesWithDetails(combineFavoritesWithProducts(favs, prods));
      }
    };

    fetchAndCombineData();
  }, [auth]);

  return {
    favoritesWithDetails
  };
};

export default useFavorites;
