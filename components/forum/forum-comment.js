import React from "react";
import styles from "@/styles/Forum.module.css";

export default function ForumComment() {
  return (
    <>
      <form action="">
        <textarea type="text" style={{ width: "85%" }} />
      </form>
      <button
        type="button"
        className="col-3 mt-3 btn btn-secondary"
        justify-content="end"
        data-bs-toggle="modal"
        data-bs-target="#addToCartModal"
      >
        Submit
      </button>
    </>
  );
}
