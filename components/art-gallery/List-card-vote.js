import React from "react";
import Link from "next/link";
import Saveicon from "@/components/art-gallery/saveicon";
import { useSave } from "@/hooks/use-save";
import Image from "next/image";

export default function ListCardVote({ data, showModal }) {
  const { saves, addSaves, removeSaves } = useSave();

  return (
    <>
      {/* start */}
      <div className="row d-flex flex-column flex-sm-row p-0 flex-wrap gap-3 px-md-5 mx-md-5">
        {data.map((v, i) => {
          return (
            <Link
              key={v.id}
              href={`/art-gallery/vote/${v.id}`}
              className="card text-light position-relative p-0"
              style={{
                flex: "1 1 20%",
                height: "50vh",
                border: "1px solid #BBAF74",
                borderRadius: "2px",
              }}
            >
              <div className="img" style={{ objectFit: "cover", maxWidth: "100%" }}>
                <img
                  src={v.img}
                  alt="artwork"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div className="overlay">
                <h5 className="title">{v.title}</h5>
                <p className="mb-2">作者：{v.user_account}</p>
                <div>
                  <Saveicon
                    artwork={v}
                    saves={saves}
                    addSaves={addSaves}
                    removeSaves={removeSaves}
                    showModal={showModal}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {/* end */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          display: flex;
          flex-direction: column;
          justify-content: end;
          padding: 20px;
          transition: all 0.6s;
        }
        .overlay:hover {
          opacity: 1;
          background-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.85)
          );
          box-shadow: 0 0 20px #bbaf74;
        }
        .overlay > * {
          transform: translateY(30px);
          transition: transform 0.6s;
        }

        .overlay:hover > * {
          transform: translateY(0px);
        }
      `}</style>
    </>
  );
}
