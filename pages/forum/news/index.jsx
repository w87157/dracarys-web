import { useState, useEffect } from 'react';
import styles from "@/styles/Forum.module.css";
import ForumCarousel1 from "@/components/forum/Forum-Carousel-1"
import OfficialEvent from "@/components/forum/Official-Event"
import NewsList from "@/components/forum/News-List"




export default function NewsIndex() {

    useEffect(() => {
        document.title = '論壇 | Dragonfire & Sorcery';
    }, []);

    // const data = []

    const NewsData = () => {
        const [newsdatas, setNewsData] = useState([]);

        useEffect(() => {
            fetch('/api/forum')
                .then((response) => response.json())
                .then((data) => setNewsData(data));
        }, []);


    };


    return (
        <>
            <div className={`container-fluid flex-column  ${styles.forumNews}`}>
                {/* 置頂輪播 */}
                <ForumCarousel1 />


                {/* official event */}
                <OfficialEvent />

                {/* news */}
                <NewsList />

            </div>
        </>
    )
}
