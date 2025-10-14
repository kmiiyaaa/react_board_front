import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./BoardDetail.css";

function BoardDetail({ user }) {
  const navigate = useNavigate();

  const [post, setPost] = useState(null); //해당 글 id로 요청한 글 객체 -> 객체라서 "" 안되고 null 넣어줘야한다
  const [loading, setLodaing] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // board/:id  id 파라미터 받아오기

  const laodPost = async () => {
    // 특정글 id로 글1개 요청하기
    try {
      setLodaing(true);
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data); // 특정글 id 객체를 state에 등록
      console.log(res.data.title);
    } catch (err) {
      console.error(err);
      setError("해당 게시글은 존재하지 않습니다.");
      //alert("해당 게시글은 존재하지 않습니다.");
    } finally {
      setLodaing(false);
    }
  };

  useEffect(() => {
    laodPost();
  }, [id]);

  if (loading) return <p>게시글 로딩중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post)
    return <p style={{ color: "blue" }}>해당 게시글이 존재하지 않습니다.</p>;

  //로그인 상태이면서 로그인한 유저와 글을 쓴 유저가 동일할 때
  const isAuthor = user && user === post.author.username;

  return (
    <div className="detail-container">
      <h2>{post.title}</h2>
      <p className="author">작성자 : {post.author.username}</p>
      <div className="content">{post.content}</div>

      <div className="button-group">
        <button onClick={() => navigate("/board")}>글목록</button>

        {/*로그인한 유저가 본인이 쓴 글만 수정,삭제 가능 */}

        {isAuthor && (
          <>
            <button>수정</button>
            <button>삭제</button>
          </>
        )}
      </div>
    </div>
  );
}

export default BoardDetail;
