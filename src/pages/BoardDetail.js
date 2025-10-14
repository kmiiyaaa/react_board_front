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
  

  //클릭한 글의 id로 글 한개 가져오기
  const loadPost = async () => {
    // 특정글 id로 글1개 요청하기
    try {
      setLoading(true);
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data); // 특정글 id 객체를 state에 등록
      console.log(res.data.title);
    } catch (err) {
      console.error(err);
      setError("해당 게시글은 존재하지 않습니다.");
      //alert("해당 게시글은 존재하지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  // 글 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      //확인 -> true, 취소->false  => ! 넣고 반대로 해서 참이면 멈추게
      return;
    }
    try {
      await api.delete(`/api/board/${id}`);
      alert("게시글 삭제 성공");
      navigate("/board");
    } catch (err) {
      console.error(err);
      if (err.response.status === 403) {
        alert("삭제 권한이 없습니다.");
      } else {
        alert("삭제할 글 존재하지 않습니다.");
      }
    }
  };

  const handleUpdate = async () => {
    if(!window.confirm("정말 수정하시겠습니까?")) { 
      return;
    }
    try {
      const res = await api.put(`/api/board/${id}`, {title,content});
      alert("게시글이 수정 되었습니다");
      setPost(res.data); //새로 수정된 글로  post변수값 변경
      setEditing(false); //상세보기 화면으로 전환

    } catch (err) {
      console.error(err);
       if (err.response.status === 403) {
        alert("수정 권한이 없습니다.");
      } else {
        alert("수정 실패");
      }
    }
  }

  if (loading) return <p>게시글 로딩중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post)
    return <p style={{ color: "blue" }}>해당 게시글이 존재하지 않습니다.</p>;

  //로그인 상태이면서 로그인한 유저와 글을 쓴 유저가 동일할 때
  const isAuthor = user && user === post.author.username;

  return (
    <div className="detail-container">

      {editing ? (
        <div className="edit-form">
          <h2>글 수정하기</h2>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="button-group">
            <button className="edit-button" onClick={}>저장</button>
            <button className="delete-button" onClick={() => setEditing(false)}>취소</button>
          </div>
        </div>
    ):(
      <>
      <h2>{post.title}</h2>
      <p className="author">작성자 : {post.author.username}</p>
      <div className="content">{post.content}</div>

      <div className="button-group">
        <button className="list-button" onClick={() => navigate("/board")}>
          글목록
        </button>

        {/*로그인한 유저가 본인이 쓴 글만 수정,삭제 가능 */}

        {isAuthor && (
          <>
            <button className="edit-button" onClick={() => setEditing(true)}>
              수정
            </button>
            <button className="delete-button" onClick={handleDelete}>
              삭제
            </button>
        </>
        )}
        </div>
      </>
      )}
     
    </div>
  );
}

export default BoardDetail;
