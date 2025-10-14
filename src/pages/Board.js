import { useEffect, useState } from "react";
import "./Board.css";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./BoardWrite.css";

function Board({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //게시판 모든글 요청
  const laodPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/board"); //모든 게시글 가져오기 요청
      setPosts(res.data); // posts -> 전체 게시글 -> 게시글의 배열
    } catch (err) {
      console.error(err);
      setError("게시글을 불러오는 데 실패하였습니다.");
      setPosts([]); //게시글들의 배열 다시 초기화
    } finally {
      setLoading(false);
    }
  };

  const handleWrite = () => {
    //로그인한 유저만 글쓰기 허용
    if (!user) {
      //참이면 로그인하지 않은 경우
      alert("로그인 후 글 작성이 가능합니다.");
      return;
    }
    navigate("/board/write");
  };

  useEffect(() => {
    laodPosts();
  }, []);

  //날짜 format 함수
  const formatDate = (dateString) => {
    //const date = new Date(dateString);
    return dateString.substring(0, 10);
  };

  return (
    <div className="container">
      <h1>게시판</h1>

      {loading && <p>게시판 글 리스트 로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts
              .slice() //얕은 복사
              .reverse() // 최신글이 위로 오게
              .map((p, index) => (
                <tr key={p.id}>
                  <td>{posts.length - index}</td>
                  <td>{p.title}</td>
                  <td>{p.author.username}</td>
                  <td>{formatDate(p.createDate)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4">게시물이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="write-button-container">
        <button onClick={handleWrite} className="write-button">
          글쓰기
        </button>
      </div>
    </div>
  );
}

export default Board;
