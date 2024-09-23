import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import axios from 'axios';


const storageKey = "user-cart"
const favoritesStorageKey = 'user-favorites';

// 1. 建立與導出context
const CartContext = createContext(null)

// 2. 建立一個Context Provider(提供者)元件
// 目的: 提供給最上層元件(_app.js)方便使用，共享狀態在這裡面統一管理
// children指的是被包覆在CartProvider中的所有子女元件
export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const { auth } = useAuth()

  // useEffect(() => {
  //   const storedFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];
  //   setFavorites(storedFavorites);
  // }, []);

  // 更新 localStorage 中的最愛商品
  const updateFavoritesInLocalStorage = (updatedFavorites) => {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(updatedFavorites));
  };

  // 切換最愛商品的狀態
  const toggleFavorite = async (productId) => {
    const isFavorited = favorites.includes(productId);
    const updatedFavorites = isFavorited
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(updatedFavorites);

    if (!auth.login) {
      updateFavoritesInLocalStorage(updatedFavorites.filter(Boolean));
    } else {
      try {
        if (isFavorited) {
          await axios.delete(`http://localhost:8080/shop/favorites/${productId}`, {
            headers: { Authorization: `Bearer ${auth.token}` },
            data: { login: auth.login }
          });
        } else {
          await axios.post('http://localhost:8080/shop/favorites', {
            fk_player_account: auth.login,
            fk_product_id: productId
          }, {
            headers: { Authorization: `Bearer ${auth.token}` }
          });
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
  };

  // 同步 localStorage 中的最愛商品到資料庫
  useEffect(() => {
    const syncFavorites = async () => {
      if (auth.login) {
        const localFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];

        if (localFavorites.length > 0) {
          try {
            await axios.post('http://localhost:8080/shop/favorites/sync', {
              login: auth.login,
              favorites: localFavorites
            }, {
              headers: { Authorization: `Bearer ${auth.token}` }
            });
            localStorage.removeItem(favoritesStorageKey);
          } catch (error) {
            console.error('Error syncing favorites:', error);
          }
        }

        try {
          const response = await axios.get('http://localhost:8080/shop/favorites', {
            headers: { Authorization: `Bearer ${auth.token}` },
            params: { login: auth.login }
          });
          setFavorites(response.data.map(fav => fav.fk_product_id));
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      } else {
        const storedFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];
        setFavorites(storedFavorites);
      }
    };

    syncFavorites();
  }, [auth]);

  // 清空最愛
  const clearShopFavorites = () => {
    setFavorites([]);
    if (!auth.login) {
      localStorage.setItem(favoritesStorageKey, JSON.stringify([]));
    }
  };



  const increaseItem = (id) => {
    setItems((preItems) => {
      const nextItems = preItems.map((v, i) => {
        // 如果符合(id=傳入的id)，遞增qty的數量
        if (v.id === id) return { ...v, qty: v.qty + 1 }
        // 否則保持原本的物件值
        else return v
      })
      // setItems(nextItems)
      localStorage.setItem(storageKey, JSON.stringify(nextItems));
      // console.log(items);
      // console.log(nextItems);
      return nextItems
    })
  }

  // 遞減項目
  const decreaseItem = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      ).filter((item) => item.qty > 0) // 確保數量大於0
    )
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  // 移除項目
  const removeItem = (id) => {
    setItems((prevItems) => {
      const updateItems = prevItems.filter((v) => v.id !== id)
      localStorage.setItem(storageKey, JSON.stringify(updateItems))
      return updateItems
    })
  }

  // 新增項目
  const addItem = (product) => {
    // 先尋找商品是否已在購物車項目中(沒有找到的話會回傳-1)
    const foundIndex = items.findIndex((v) => v.id === product.id)

    if (foundIndex > -1) {
      // 商品已存在，增加數量
      localStorage.setItem(storageKey, JSON.stringify(items));
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      // 商品不存在，新增到購物車
      localStorage.setItem(storageKey, JSON.stringify(items));
      setItems((prevItems) => [...prevItems, { ...product, qty: 1 }]);
    }

  }

  // 清空購物車
  const clearCart = () => {
    setItems([]);
    localStorage.setItem(storageKey, JSON.stringify([]));
  };

  // 用陣列迭代方法reduce來計算總金額/總數量
  const totalQty = items.reduce((acc, v) => acc + v.qty, 0)
  const totalPrice = items.reduce((acc, v) => acc + v.qty * v.price, 0)

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
    // const savedFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];
    // console.log(savedItems);
    setItems(savedItems);
    // setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    if (items.length !== 0) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items]);

  return (
    <CartContext.Provider
      // 使用value屬性提供資料給元件階層以下的所有後代元件(如果是消費者的話)
      value={{
        items,
        totalQty,
        totalPrice,
        addItem,
        increaseItem,
        decreaseItem,
        removeItem,
        storageKey,
        favorites,
        toggleFavorite,
        clearCart,
        clearShopFavorites,
        favoritesStorageKey,
        updateFavoritesInLocalStorage,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// 3. 建立一個包裝useContext的專用名稱函式
// 目的: 讓消費者們(consumer)方便使用，呼叫useCart就可以取得共享狀態
export const useCart = () => useContext(CartContext)