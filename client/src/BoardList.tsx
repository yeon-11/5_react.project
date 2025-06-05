// import { Component } from "react";
import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, ButtonGroup } from "react-bootstrap";
import Axios from "axios"; //axios: 미들웨어
import { Prev } from "react-bootstrap/esm/PageItem";
// npm(node package manage) install axios 의존성 주입
// mysql에 만들었던 board(테이블)에 데이터베이스를 react에서 열릴수 있도록 설정

// props: 조분해 할당 방식
const Board = ({ // 테이블에 들어가는 네임값과 타입{변수타입}을 설정
    id,
    title,
    registerId,
    registerDate,
    onCheckboxChange,
}: {
    id: number;
    title: string;  // string: 몇개의 항목이 들어갈건지 정의
    registerId: string;
    registerDate: string
    onCheckboxChange: (checked: boolean, id: string) => void;
}) => {
    return (
        <tr>
            <td className="d-flex justify-content-center align-items-center">
                <input type="checkbox"
                    className="form-check"
                    value={id}
                    onChange={(e) => onCheckboxChange(e.currentTarget.checked, e.currentTarget.value)}
                />
            </td>
            <td className="text-center">{id}</td>
            <td>{title}</td>
            <td className="text-center">{registerId}</td>
            <td className="text-center">{registerDate}</td>
        </tr>
    );
};

interface IProps { // java에도 있는 interface는 바디가 없는 구현제 클래스보다 큰 개념
    isComplete: boolean;
    handleModify: (checkList: string[]) => void;
    renderComplete: () => void
}

const BoardList: React.FC<IProps> = ({ isComplete, handleModify, renderComplete }) => {
    //FC: Function Component
    const [boardList, setBoardList] = useState<any[]>([]); // 초기값이 비어있는 게시물 목록 상태
    const [checkList, setCheckList] = useState<string[]>([]); // 타입을 string[]로 명시하여 문자열 배열만 들어가도록 지정

    // add: 현재 페이지 상태 추가
    const [currentPage, setCurrentPage] = useState<number>(1);

    // 페이지당 게시물수 고정값
    const pageSize = 10;

    // 총 페이지수 받아올 상태 (서버에서 받아옴)
    const [totalPages, setTotalPages] = useState<number>(1);

    /* state = { // 예전방식
    boardList: [], // 비워져있는 배열
    }; */


    const getList = (page = 1) => {
        Axios.get(`http://localhost:8080/list?page=${page}&size=${pageSize}`)
            .then((res) => {
                console.log("서버 응답:", res.data);

                const { data, totalCount } = res.data;

                setBoardList(Array.isArray(data) ? data : []);

                const safeTotalCount = typeof totalCount === "number" && totalCount >= 0 ? totalCount : 0;
                const pages = Math.ceil(safeTotalCount / pageSize);
                setTotalPages(pages > 0 ? pages : 1);

                setCurrentPage(page);
                renderComplete();
            })
            .catch((e) => {
                console.error("API 오류:", e);
                setBoardList([]);
                setTotalPages(1);
            });
    };


    const onCheckboxChange = (checked: boolean, id: string) => { // 체크박스 상태를 관리 (체크 되어있는지)
        setCheckList((prev) => { //이전 체크리스트 상태를 기준, 새상태 계산
            const filtered = prev.filter((v) => v !== id); // 현재 상태 배열에서 해당 id 제거
            return checked ? [...filtered, id] : filtered; // 체크박스가 체크되었으면 id 추가
        })
    }

    useEffect(() => { // 컴포넌트가 마운트(처음 렌더링 될때) 실행되는 hook
        getList(1);
    }, []); // 인자가 빈 배열[] 이므로 한번만 실행
    // 컴포넌트가 처음 화면에 그려질때 getList 함수를 호출해 데이터 불러옴

    useEffect(() => {
        if (!isComplete) { // 상태, props 변경될때마다 실행 (거짓일때만) getList 호출
            getList(currentPage);
        }
    }, [isComplete]);

    // 페이지 이동 핸들러
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        getList(page);
    }


    // render() { // 상태(이벤트)를 출력하는 렌더 함수
    // const { boardList }: { boardList: any } = this.state;
    // this.state 객체안에 있는 boardList을 꺼내서 const 보드리스트로 선언
    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="my-5 text-secondary text-bold">BBS</h1>
                    <Table striped bordered hover>
                        <colgroup>
                            <col style={{ width: "5%" }} />
                            <col style={{ width: "5%" }} />
                            <col style={{ width: "70%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                        </colgroup>
                        <thead>
                            <tr className="text-center">
                                <th>선택</th><th>번호</th><th>제목</th><th>작성자</th><th>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(boardList) && boardList.length > 0 ? (
                                boardList.map((v: any) => (
                                    <Board
                                        key={v.BOARD_ID}
                                        id={v.BOARD_ID}
                                        title={v.BOARD_TITLE}
                                        registerId={v.REGISTER_ID}
                                        registerDate={v.REGISTER_DATE}
                                        onCheckboxChange={onCheckboxChange}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">게시글이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-center my-3">
                        <ButtonGroup>
                            <Button variant="outline-primary"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >이전</Button>

                            {[...Array(totalPages > 0 ? totalPages : 1)].map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === currentPage ? "primary" : "outline-primary"}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                            <Button
                                variant="outline-primary"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >다음</Button>

                        </ButtonGroup>
                    </div>

                    <div className="mt-5 mb-3 d-flex justify-content-end">
                        <ButtonGroup>
                            <Button variant="outline-primary">
                                작성
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => handleModify(checkList)}
                            >
                                수정
                            </Button>
                            <Button variant="outline-danger">
                                삭제
                            </Button>
                        </ButtonGroup>
                    </div>

                </Col>
            </Row>
        </Container>

    );
}

export default BoardList; // 모듈화 되었을때 화면에서 보여지게 해줌

/* // 만들어진 로직(리스트로직:[getList]을 화면에 붙인다
componentDidMount() {
this.getList();
} */
