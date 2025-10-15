import { useEffect, useState } from "react";
import "./Board.css";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./BoardWrite.css";

function Board({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  //페이징된 게시판 모든글 요청
  const laodPosts = async (page = 0) => {
    try {
      setLoading(true); // 이게 없으면 로딩 다 하기전에 찍어서 오류남
      const res = await api.get(`/api/board?page=${page}&size=10`); //모든 게시글 가져오기 요청
      setPosts(res.data.posts); // posts -> 전체 게시글 -> 게시글의 배열
      //res안(posts,currentPage,...)에 있는 posts빼줘야한다
      setCurrentPage(res.data.currentPage); //현재 페이지
      setTotalPages(res.data.totalPages); //전체 페이지
      setTotalItems(res.data.totalItems); //모든글 갯수
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
    laodPosts(currentPage);
  }, [currentPage]); // 원래 0이었다가 페이지 바뀌면 재로딩

  // 페이지 번호 그룹 배열 반환 함수 (10개 까지만 표시)
  // ex) 총페이지 수 : 157개글 -> 총 16페이지 필요 -> [0,2,3,4,5,..,9]
  // ▶ -> [10,12,..,16]
  const getPageNumbers = () => {
    const startPage = Math.floor(currentPage / 10) * 10;
    //0 1 2 3 4  -> 5 6 7 8 9 : 5개씩 자른다하면 Math.floor(currentPage / 5) * 5;
    const endPage = startPage + 10 > totalPages ? totalPages : startPage + 10;
    //마지막 페이지 번호가 계산된 endpage값보다 작을 경우 마지막 페이지를 endpage값으로 변경하여
    // 마지막 페이지 까지만 페이지 그룹이 출력되도록
    const pages = [];
    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

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
                  <td
                    className="click-title"
                    onClick={() => navigate(`/board/${p.id}`)}
                  >
                    {p.title}
                  </td>
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

      {/* 페이지 번호와 이동화살표 출력 */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          ◀
        </button>
        {getPageNumbers().map((num) => (
          <button key={num} onClick={() => setCurrentPage(num)}>
            {num + 1}
          </button> //loadPosts(num)넣으면 무한루프 된다.
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
        >
          ▶
        </button>
      </div>

      <div className="write-button-container">
        <button onClick={handleWrite} className="write-button">
          글쓰기
        </button>
      </div>
    </div>
  );
}

export default Board;
