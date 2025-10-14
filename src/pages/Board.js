import "./Board.css";

function Board() {
  return (
    <div className="container">
      <h1>게시판</h1>
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
          <td>1</td>
          <td>안녕하세요 첫글 입니다.</td>
          <td>tiger</td>
          <td>2025-10-14</td>
        </tbody>
      </table>
      <div className="write-button-container">
        <button className="write-button">글쓰기</button>
      </div>
    </div>
  );
}

export default Board;
