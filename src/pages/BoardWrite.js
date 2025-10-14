import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./BoardWrite.css";

function BoardWrite({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //페이지 새로고침 방지

    //로그인한 유저만 글쓰기 허용
    if (!user) {
      //참이면 로그인하지 않은 경우
      alert("로그인 후 글 작성이 가능합니다.");
      return;
    }

    try {
      await api.post("/api/board", { title, content });
      alert("글작성 성공");
      navigate("/board");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="write-container">
      <h2>글쓰기</h2>
      <form onSubmit={handleSubmit} className="write-form">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="button-group">
          <button type="submit">등록</button>
          <button type="button" onClick={() => navigate("/board")}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardWrite;
