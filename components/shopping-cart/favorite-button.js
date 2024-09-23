import { useState, useEffect } from "react";
import { heartIcon, heartIconFill } from "@/asset/icon";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Shop.module.css"
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';

const FavoriteButton = function FavoriteButton({ productId, showModal }) {
  const { auth } = useAuth();
  const { favorites, toggleFavorite } = useCart();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (favorites) {
      setIsFavorited(favorites.includes(productId));
    }
  }, [favorites, productId]);

  const handleToggleFav = async () => {
    try {
      await toggleFavorite(productId);
      if (!auth.token) {
        showModal('請先登入會員');
      } else {
        setIsFavorited(!isFavorited);
        showModal(isFavorited ? '移除收藏成功' : '加入收藏成功');
      }
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  return (
    <>
      <Link
        href="#/"
        role="button"
        className={`link ${styles.heartBtn}`}
        onClick={handleToggleFav}
      >
        <Image
          src={!auth.token ? heartIcon : (isFavorited ? heartIconFill : heartIcon)}
          alt=""
          height={20}
          width={20}
        />
      </Link>
    </>
  );
}

export default FavoriteButton
