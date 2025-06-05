import React, { useState, useEffect, useCallback } from "react";
// import {Component} from "react"; class형일때 사용
import { Form, Button, Container, Row, Col, ButtonGroup } from "react-bootstrap";
//axios: react에서 api통신할때 사용하는 모듈
import Axios from "axios"; //미들웨어

interface IPros {
    isModifyMode: boolean;
    boardId: number;
    handleCancel: () => void; // void: 반환되는 값이 없음, 모달닫기 또는 상태 초기화
}

/* class Write extends Component{
    render(){ */
const Write: React.FC<IPros> = ({ isModifyMode, boardId, handleCancel }) => {
    //write: 쓰기 👉 글쓰기 → 성공/실패

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");


    /* //상태초기화
     const [isModifyMode, setIsModifyMode] = useState(false);
     //수정모드 → 현재 작성모드(false), 수정모드(true)
     const [formData, setFormData] = useState({
         id: null, title: "", content: "",
     }) //사용자가 입력한 제목과 내용을 상태(state)로 관리 */


    //입력 핸들러: 폼의 속성(title, content)를 키로 사용하여 상태 업데이트
    // <HTMLInputElement | HTMLTextAreaElement>: input 또는 textarea에서 발생하는 이벤트 처리
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "title") setTitle(value);
        else if (name === "content") setContent(value);

        //e.target: 이벤트가 발생한 dom요소. 값을 추출하여 폼상태 업데이트
        /* setFormData((prevData) => ({
            //setFormData: 폼데이터를 저장상태 업데이트
            ...prevData,
            //prevData: 이전 폼데이터 삭제, 스프레드 연산자(...)로 기존 데이터 복사
            [name]: value,
            // 해당 필드값만 업데이트 */
        // }));
    }

    //write 쓰기
    const write = () => {
        Axios.post("http://localhost:8080/insert", { title, content })
            .then(() => {
                setTitle("");
                setContent("");
                handleCancel();
            }).catch((e) => console.error(e));
    }

    //update 수정
    const update = () => {
        Axios.post("http://localhost:8080/update", { title, content, id: boardId })
            .then(() => {
                setTitle("");
                setContent("");
                handleCancel();
            }).catch((e) => console.error(e));
    }

    //detail
    const detail = useCallback(() => {
        Axios.get(`http://localhost:8080/detail?id=${boardId}`)
            .then((res) => {
                if (res.data.length > 0) {
                    setTitle(res.data[0].BOARD_TITLE);
                    setContent(res.data[0].BOARD_CONTENT);
                }
            }).catch((e) => console.error(e));
    }, [boardId]);

    useEffect(() => {
        if (isModifyMode) {
            detail();
        }
    }, [isModifyMode, boardId, detail]);


    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>제목</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={handleChange}
                                    placeholder="제목을 입력 하세요"
                                />
                            </Form.Group>
                            <Form.Group className="my-3">
                                <Form.Label>내용</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="내용을 입력하세요"
                                    name="content"
                                    value={content}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>

                        <div>
                            <div className="d-flex justify-content-end mt-4 mb-2">
                                <ButtonGroup>
                                    <Button variant="primary"
                                        onClick={isModifyMode ? update : write}>
                                        완료
                                    </Button>

                                    <Button variant="danger"
                                        onClick={handleCancel}
                                    >취소</Button>
                                </ButtonGroup>
                            </div>
                        </div>

                    </Col>
                </Row>
            </Container>
        </>

    )
}


export default Write;

//상태 초기화
/*state = {
    isModifyMode : false,//수정모드 허용하지 않음
title:"",//타이틀 비우고
content:"",//내용 비우고
}

//write: 실행하는 함수, get기존에 있는 내용 리턴
write = () => {
    Axios.post("http://") //post: 쓰는 명령어
}*/