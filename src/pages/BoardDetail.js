import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./BoardDetail.css";

function BoardDetail({ user }) {
  const navigate = useNavigate();

  const [post, setPost] = useState(null); //해당 글 id로 요청한 글 객체 -> 객체라서 "" 안되고 null 넣어줘야한다
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false); // 수정 화면 출력 여부
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { id } = useParams(); // board/:id  id 파라미터 받아오기

  //클 //클릭한 글의 id로 글 1개 가져오기
  const loadPost = async () => {
    //특정 글 id로 글 1개 요청하기
    try {
      setLoading(true);
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data); //특정 글 id 객체를 state에 등록
      setTitle(res.data.title);
      //원본 글의 제목을 수정화면에 표시하는 변수인 title 변수에 저장
      setContent(res.data.content);
      //원본 글의 내용을 수정화면에 표시하는 변수인 content 변수에 저장
    } catch (err) {
      console.error(err);
      setError("해당 게시글은 존재하지 않습니다.");
      // alert("해당 게시글은 존재하지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  //글삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      //확인->true, 취소->false
      return;
    }
    try {
      await api.delete(`/api/board/${id}`);
      alert("게시글 삭제 성공!");
      navigate("/board");
    } catch (err) {
      console.error(err);
      if (err.response.status === 403) {
        alert("삭제 권한이 없습니다.");
      } else {
        alert("삭제 실패!");
      }
    }
  };

  const handleUpdate = async () => {
    if (!window.confirm("정말 수정하시겠습니까?")) {
      //확인->true, 취소->false
      return;
    }
    try {
      const res = await api.put(`/api/board/${id}`, { title, content });
      alert("게시글이 수정되었습니다.");
      setPost(res.data); //새로 수정된 글로 post 변수 값 변경
      setEditing(false); //상세보기 화면으로 전환
    } catch (err) {
      console.error(err);
      if (err.response.status === 403) {
        alert("수정 권한이 없습니다.");
      } else {
        alert("수정 실패!");
      }
    }
  };

  //댓글 관련 이벤트 처리

  const [newComment, setNewComment] = useState(""); // 새로운 댓글 저장 변수
  const [comments, setComments] = useState([]); // 백엔드에서 가져온 기존 댓글 배열
  const [editCommentContent, setEditCommentContent] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);

  //날짜 format 함수 -> 날짜,시간 출력
  const formatDate = (dateString) => {
    return dateString.substring(0, 10);
  };

  //댓글 제출 함수
  const handleCommentSubmit = () => {};

  //댓글 삭제 함수
  const handleCommentDelete = (commentId) => {};

  //댓글 수정 이벤트 함수
  const handleCommentUpdate = () => {};

  if (loading) return <p>게시글 로딩 중....</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post)
    return <p sytle={{ color: "blue" }}>해당 게시글이 존재하지 않습니다.</p>;

  //로그인 상태이면서 로그인한 유저와 글을 쓴 유저가 같은때->참
  const isAuthor = user && user === post.author.username; //user : 현재 로그인한 유저의 state

  return (
    <div className="detail-container">
      {editing ? (
        <div className="edit-form">
          <h2>글 수정하기</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="button-group">
            <button className="edit-button" onClick={handleUpdate}>
              저장
            </button>
            <button className="delete-button" onClick={() => setEditing(false)}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p className="author">작성자 : {post.author.username}</p>
          <div className="content">{post.content}</div>

          <div className="button-group">
            <button className="list-button" onClick={() => navigate("/board")}>
              글목록
            </button>

            {/* 로그인한 유저 본인이 쓴글만 삭제 수정 가능 */}
            {isAuthor && (
              <>
                <button
                  className="edit-button"
                  onClick={() => setEditing(true)}
                >
                  수정
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  삭제
                </button>
              </>
            )}
          </div>

          {/* 댓글영역 시작 */}
          <div className="comment-section">
            {/*댓글 입력폼 */}
            <h3>댓글 쓰기</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button type="submit" className="comment-button">
                등록
              </button>
            </form>

            {/* 기존 댓글 리스트 시작! */}
            <ul className="comment-list">
              {comments.map((c) => (
                <li key={c.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{c.author.username}</span>
                    <span className="comment-date">
                      {formatDate(c.createDate)}
                    </span>
                  </div>

                  <div className="comment-content">{c.content}</div>
                  <div className="button-group">
                    <button
                      className="list-button"
                      onClick={() => navigate("/board")}
                    >
                      글목록
                    </button>

                    {/* 로그인한 유저 본인이 쓴글만 삭제 수정 가능 */}
                    {user === c.author.username && (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => handleCommentUpdate(c)}
                        >
                          수정
                        </button>
                        <button
                          className="delete-button"
                          onClick={handleCommentDelete(c.id)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {/* 기존 댓글 리스트 끝! */}
          </div>
          {/* 댓글 영역 끝! */}
        </>
      )}
    </div>
  );
}

export default BoardDetail;
