import React from "react";
import { Routes, Route, Link } from 'react-router-dom';
import './Main.css';
import Button from 'react-bootstrap/Button';


function Main() {
    return(
        <div>
            <br/>
            <div className="mainimg">
                <div className="maintext">
                    안녕하세요! 구석기에 오신 것을 환영합니다🥰<br/>
                    <span style={{color: "#9b111e"}}>구석기 (goosukki) </span>이란, 구석구석 추억 탐방기라는 의미를 담고 있습니다.<br/>
                    저희 사이트는 지도를 기반으로 한 sns로, <br/>
                    지도에 마커를 표시하고 해당 위치에 게시글을 남기는 방식으로 여러분들의 추억을 남길 수 있습니다.<br/>
                    아래 버튼을 클릭하여 여러분의 라이프 하나하나를 기록해보세요!
                </div>
            </div>
            <br/>
    
            <Button variant="primary" size="lg">
                <Link to="/currentplace"><div style={{color:"white"}}>시작하기</div></Link>
            </Button>
        </div>
    )
}


export default Main;