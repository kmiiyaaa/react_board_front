import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BoardDetail({ user }) {
  const navigate = useNavigate();

  const [post, setPost] = useState(null); //해당 글 id로 요청한 글 객체 -> 객체라서 "" 안되고 null 넣어줘야한다

  const laodPost = async () => {
    // 특정글 id로 글1개 요청하기
  };

  return (
    <div className="detail-container">
      <h2>[제목]오늘 첫글</h2>
      <p className="author">작성자 : tiger</p>
      <div className="content">[글내용] 글내용 입니다</div>

      <div className="button-group">
        <button onClick={() => navigate("/board")}>글목록</button>

        {/*로그인한 유저가 본인이 쓴 글만 수정,삭제 가능 */}
        <button>수정</button>
        <button>삭제</button>
      </div>
    </div>
  );
}

export default BoardDetail;
