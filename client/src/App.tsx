import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import BoardList from './BoardList';//보드리스트라는 컴포넌트를 사용
import Write from './write';
import Slide from './Slide';
import Header from './include/Header';
import Footer from './include/Footer';
//부트스트랩 cdn선언


const App: React.FC = () => {
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [isComplete, setIsComplete] = useState(true);
  const [boardId, setBoardId] = useState(0);

  const handleModify = (checkList: any) => { //게시글 수정
    if (checkList.length === 0) { //선택하지 않았다면
      alert('수정할 게시물을 선택하세요')
    } else if (checkList.length > 1) { //복수 선택시
      alert('하나의 게시글만 선택하세요');
    }

    //수정모드 진입여부 설정
    setIsModifyMode(checkList.length === 1);
    //선택된 게시글 아이디 설정
    setBoardId(checkList[0] || 0); // 첫번째 선택항목 아이디 설정, 없으면 기본값(0)
  }

  const handleCancle = () => {
    setIsModifyMode(false);
    setIsComplete(false);
    setBoardId(0);
  }

  const renderComplete = () => {
    setIsComplete(true);
  }

  return (
    <>
      <Header />
      <Slide />
      <BoardList
        isComplete={isComplete}
        handleModify={handleModify}
        renderComplete={renderComplete}
      />
      <Write
      isModifyMode = {isModifyMode}
      boardId = {boardId}
      handleCancel = {handleCancle}
      />
      <Footer />
    </>
  );
}

export default App;