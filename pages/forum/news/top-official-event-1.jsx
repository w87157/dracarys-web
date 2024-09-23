import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@/styles/Forum.module.css';
import ContentTop from '@/components/forum/Content-Top';
import Image from 'next/image';
import Link from 'next/link';

export default function TopOfficialEvent1() {
    useEffect(() => {
        document.title = '論壇 | Dragonfire & Sorcery';
    }, []);

    const router = useRouter();
    // const { title } = router.query;
    // const [event, setEvent] = useState(null);

    // useEffect(() => {
    //     if (title) {
    //         fetch(`http://localhost:8080/forum/events`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 if (data.length > 0) {
    //                     setEvent(data[0]); // 假設返回一個活動陣列，我們取第一個
    //                 }
    //             })
    //             .catch(error => console.error('400', error));
    //     }
    // }, [title]);

    // if (!event) {
    //     return <div>本期活動已經結束</div>;
    // }

    return (
        <div className={`container-fluid flex-column ${styles.forumNews}`}>
            <div className={`container mb-5 ${styles.forumContainer}`}>
                <div className={`row d-flex ${styles.forumRow}`}>
                    <div className={`row ${styles.forumRow}`}>
                        <div className={`col-12 d-flex gap-2 ${styles.forumEvent}`}>
                            <div className={`row mt-5 mb-3 justify-content-center`}>
                                <h2 className={styles.forumHeading}>藝術走廊歡迎你投稿</h2>
                                <hr style={{ color: '#bbaf74' }} />

                                <ContentTop />

                                <article className={`row col-12`}>
                                    <p className={`mt-3 mb-3 ${styles.forumArticle}`}>我們非常高興地宣布，遊戲中的藝術走廊將再次向大家開放，並歡迎所有熱愛創作的玩家前來投稿！無論你是擅長畫畫、手工、數位創作，還是有獨特的設計理念，我們都期待看到你的傑作！</p>
                                    <p className={`mt-3 mb-3 ${styles.forumArticle}`}>本次投稿活動將持續一個月，期間我們會定期選出優秀作品進行展示，並在官方網站和社交媒體平台上進行推廣。所有參與者都有機會獲得豐厚的遊戲內獎勵，包括稀有道具、限定裝扮以及特別稱號！</p>
                                    <p className={`mt-3 mb-3 ${styles.forumArticle}`}>參與方式非常簡單：只需將你的作品上傳至我們的投稿專區，並附上你的遊戲ID和作品簡介。我們期待看到你獨一無二的創作，也希望你能在這個過程中享受無限的樂趣和成就感。</p>
                                </article>
                                <div className={`row d-flex justify-content-center`}>
                                    <figure className={`col-12 col-sm-6 d-flex mt-3 ${styles.eventFigure}`}>
                                        <Image
                                            className={styles.eventImg}
                                            src="/forum/person-5.jpg"
                                            alt="..."
                                            width={350}
                                            height={350}

                                        />
                                    </figure>
                                    <figure className={`col-12 col-sm-6 d-flex mt-3 ${styles.eventFigure}`}>
                                        <Image
                                            className={styles.eventImg}
                                            src="/forum/person-10.jpg"
                                            alt="..."
                                            width={350}
                                            height={350}

                                        />
                                    </figure>
                                </div>
                                <button
                                    type="button"
                                    className="col-3 mt-5 mb-5 btn btn-secondary "
                                    onClick={() => router.push("/art-gallery/register")}>
                                    活動報名連結
                                    <div className="button__horizontal"></div>
                                    <div className="button__vertical"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}