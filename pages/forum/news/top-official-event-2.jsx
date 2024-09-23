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
                                <h2 className={styles.forumHeading}>暑期狂歡禮包早鳥預購開始</h2>
                                <hr style={{ color: '#bbaf74' }} />

                                <ContentTop />

                                <article className={`row col-12`}>
                                    <p className={`mt-3 mb-3 ${styles.forumArticle}`}>炎炎夏日，暑假來臨，為了讓大家在這個充滿陽光和活力的季節裡有更多的驚喜和樂趣，我們特別推出了「暑期狂歡禮包」早鳥預購活動！即日起至暑假結束前，我們精心準備了一系列豐富多彩、充滿夏日氣息的限量禮包，等你來搶購！</p>
                                    <p className={`mt-3 mb-3 ${styles.forumArticle}`}>暑期狂歡禮包內含多種限量好禮，包括絢麗的夏日服飾、稀有的遊戲道具、強力的增益藥水以及特別設計的夏日限定坐騎。這些珍稀物品不僅能提升你的遊戲體驗，還能讓你的角色在這個熱情洋溢的季節裡光彩奪目。此外，禮包中還附贈專屬的夏日主題裝飾，讓你可以把濃濃的夏日氣氛帶到你的遊戲世界中。</p>

                                </article>
                                <div className={`row d-flex justify-content-center`}>
                                    <figure className={`col-12 col-sm-6 d-flex mt-3 ${styles.eventFigure}`}>
                                        <Image
                                            className={styles.eventImg}
                                            src="/forum/weapon.jpg"
                                            alt="..."
                                            width={350}
                                            height={350}

                                        /></figure>
                                    <figure className={`col-12 col-sm-6 d-flex mt-3 ${styles.eventFigure}`}>
                                        <Image
                                            className={styles.eventImg}
                                            src="/forum/flag.jpg"
                                            alt="..."
                                            width={350}
                                            height={350}

                                        />
                                    </figure></div>
                                <button
                                    type="button"
                                    className="col-3 mt-5 mb-5 btn btn-secondary "
                                    onClick={() => router.push("/shop")}
                                >
                                    早鳥預購活動連結
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