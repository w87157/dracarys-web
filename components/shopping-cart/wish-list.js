import { useEffect, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/router'
import styles from "@/styles/Shop.module.css"
import Link from 'next/link'
import { FaClipboardList, FaHeart, FaTrashCan, FaPenToSquare } from "react-icons/fa6"
import Image from 'next/image'

const WishList = function WishList() {
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [memo, setMemo] = useState('')
  const [tempMemo, setTempMemo] = useState('')
  const [currentProductId, setCurrentProductId] = useState(null)
  const [memos, setMemos] = useState({})
  const { addItem } = useCart();
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const initialFavorites = localStorage.getItem('favorites')
    try {
      const favoritesItems = JSON.parse(initialFavorites)
      if (favoritesItems) {
        setFavorites(favoritesItems)
      }
    } catch (ex) { }
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/shop/p-list');
        const data = await response.json();
        console.log(data.result[0].image);
        setProducts(data.result);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);



  const handleEditMemo = (productId) => {
    setCurrentProductId(productId);
    setTempMemo(memos[productId] || '')
    setIsEditing(true)
  }



  // 清空備忘錄
  const handleClearMemo = (productId) => {
    if (productId) {
      setMemos((prevMemos) => {
        const updatedMemos = { ...prevMemos };
        delete updatedMemos[productId];
        return updatedMemos;
      });
    }
  };


  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter((productId) => productId !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const addItemToCart = (product) => {
    addItem(product);
    setSelectedProduct(product); // Save the selected product
  };


  return (
    <>
      {favorites.length === 0 ? (
        <div className="p-5 text-center">
          <div className="text-light">
            尚無收藏</div>
        </div>
      ) : (
        favorites.map((productId) => {
          const product = products.find(product => product.id === productId);
          if (!product) return null;
          return (
            product && (
              <div key={product.id} className={`p-2 ${styles.recordRow}`}>
                <div className='d-flex'>
                  <div className="col-4 col-md-2">
                    <Link href={`/shop/product/${product.id} w-100`}>
                      <Image src={product.image} alt="item" className={`w-100 ${styles["product-gradient"]}`} width="auto" height="auto" />
                    </Link></div>
                  <div className="col-7 col-md-9">
                    <div className={`row ${styles.wishListItems}`}>
                      <div className="col-12 col-md-9">
                        <h4 className='fs-regular mt-3'><Link href={`/shop/product/${product.id}`} className={styles.productLink}>{product.product_name}</Link></h4>
                        <p className="fw-300 fs-small">{product.product_desc}</p>
                      </div>
                      <div className='col-12 col-md-2 float-start float-md-end h-100 d-flex align-items-start align-items-md-center flex-column'>
                        <p className='text-primary  my-3'>鑽石 {product.price}</p>
                        <button className='w-100 btn text-bg-primary' onClick={() => addItemToCart(product)} data-bs-toggle="modal"
                          data-bs-target="#addToCartModal">購買</button>
                      </div>
                      <div className='col-9 forPC-block'>
                        {memos[productId] ? (
                          <div className={styles.myMemo}>
                            <div className='col-10'>{memos[productId]}</div>
                            <button type='button' data-bs-toggle="modal" data-bs-target="#editMemoModal" onClick={() => handleEditMemo(productId)}>編輯註解</button>
                          </div>
                        ) : (
                          <button type="button" className={styles.addMemo} data-bs-toggle="modal" data-bs-target="#addMemoModal" onClick={() => setCurrentProductId(productId)}>新增備忘錄</button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-1">
                    <div className="row">
                      <div className='col-12 my-3'>
                        <button type="button" className='bg-transparent border-0 text-primary' onClick={() => removeFromFavorites(productId)}><FaTrashCan /></button>
                        {memos[productId] ? (
                          <button type="button" className='bg-transparent border-0 text-primary forSP-block' data-bs-toggle="modal" data-bs-target="#editMemoModal" onClick={() => handleEditMemo(productId)}><FaPenToSquare /></button>
                        ) : (
                          <button type="button" className='bg-transparent border-0 text-primary forSP-block' data-bs-toggle="modal" data-bs-target="#addMemoModal" onClick={() => setCurrentProductId(productId)}><FaPenToSquare /></button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-12 forSP-block'>
                  {memos[productId] ? (
                    <div className={styles.myMemo}>
                      <div className='col-10'>{memos[productId]}</div>
                      <button type='button' data-bs-toggle="modal" data-bs-target="#editMemoModal" onClick={() => handleEditMemo(productId)}>編輯</button>
                    </div>
                  ) : (
                    null
                    // <button type="button" className={styles.addMemo} data-bs-toggle="modal" data-bs-target="#addMemoModal" onClick={() => setCurrentProductId(productId)}>新增備忘錄</button>
                  )}
                </div>
              </div>
            )
          )
        }
        ))}
    </>
  )
}

export default WishList
