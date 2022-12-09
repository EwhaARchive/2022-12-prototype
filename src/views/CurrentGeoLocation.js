import React , { useState, useEffect } from "react";
import './CurrentGeoLocation.css';

const { kakao } = window;

function CurrentGeoLocation() {

    const date = new Date();
    let curDate = date.toLocaleTimeString('ko-kr');

    // 내 위치 가져오기 버튼 클릭 시 true로 변경
    let [getLocation, setGetLocation] = useState(false);

    // 마커 클릭 시 입력창 등장
    let [showInput, setShowInput] = useState(false);

    // 현재 위치 [locPosition.getLat(), locPosition.getLng()] 형태로 저장
    let [curLatLng, setCurLatLng] = useState('');

    // 사용자가 입력한 제목과 내용 
    const [userInput, setUserInput] = useState({
        title: '',
        body: ''
    });

    // showUserMarker가 true일 시 사용자가 입력한 내용대로 마커가 찍힘
    let [showUserMarker, setShowUserMarker] = useState(false);

    const {title, body} = userInput; // 비구조화 할당 문법

    const onChangeInput = (e) => {
        const {name, value} = e.target // destructuring
        setUserInput({
            ...userInput,
            [name]: value
        })
    };

    useEffect( () => {
        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = { 
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

        // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
        var map = new kakao.maps.Map(mapContainer, mapOption);   

        // mapDrawer : 지도가 있는 창이 열렸을 때, 지도 div에 카카오맵 지도를 그려 주는 함수
        mapDrawer(map);

        // 마커 생성하기 클릭 시 curLatLng 좌표에 따라서 노란색 마커 생성
        if(showUserMarker) displayUserMarker(map);
    } );

    // 실시간 위치 추적해주는 api 사용 (비동기 함수)
    function getMyLocation() {
        return new Promise( (resolve, reject) => { //resolve는 성공할 때 값
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } );
    }

    // mapDrawer : 지도가 있는 창이 열렸을 때, 지도 div에 카카오맵 지도를 그려 주는 함수
    async function mapDrawer(map) {

        // 지도에 마커와 인포윈도우를 표시하는 함수입니다
        function displayMarker(locPosition, message) {

            let overlayContent = '';

            if (message === 'success') {
                overlayContent 
                = '<span class="info-title canSearch">'
                +'여기에 계신가요?!'+'<br/>'
                +'<button id="yesbtn">예</button>'
                +'<button id="nobtn">아니오</button>'
                +'</span>';
            } else {
                overlayContent = '<span class="info-title cannotSearch">GeoLocation API를 사용할 수 없어요</span>';
            }

            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({  
                map: map, 
                position: locPosition
            }); 
            
            // 커스텀오버레이를 생성합니다
            var customOverlay = new kakao.maps.CustomOverlay({
                content : overlayContent,
                position: marker.getPosition()
            });
            
            // 커스텀오버레이를 마커위에 표시합니다 
            customOverlay.setMap(map);
            
            // 지도 중심좌표를 접속위치로 변경합니다
            map.setCenter(locPosition); 
            
            // 예를 클릭할 경우
            let yesbtn = document.getElementById("yesbtn");
            yesbtn.onclick = () => {
                // state에 현재 위치를 저장
                setCurLatLng([locPosition.getLat(), locPosition.getLng()]);
                // 입력창 등장
                setShowInput(true); 
            };
        }

        // 위치를 받아오기 성공한 경우
        try {
            let position = await getMyLocation();
            let lat = position.coords.latitude, lon = position.coords.longitude; // 위도, 경도
            let locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

            // 내 위치 가져오기 버튼 클릭 시 마커와 커스텀오버레이를 표시합니다
            if (getLocation) {
                displayMarker(locPosition, 'success');
            }
            
        } catch(err) {
            // 위치 받아오기 실패한 경우
            // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            var locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
                
            displayMarker(locPosition, 'fail');

        }

    }

    // 사용자가 입력한 정보대로 마커를 생성하는 함수
    function displayUserMarker(map) {
        let userLatLng = new kakao.maps.LatLng(curLatLng[0], curLatLng[1]);
        var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35); 
        
        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({  
            map: map, 
            position: userLatLng,
            image: markerImage,
            zIndex: 5
        }); 
        
        // 커스텀오버레이를 생성합니다
        var customOverlay = new kakao.maps.CustomOverlay({
            content : '<div class="userCustomOverlay">'+userInput.title+'</div>',
            position: marker.getPosition()
        });
        
        // 커스텀오버레이를 마커위에 표시합니다 
        customOverlay.setMap(map);

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function() {
            document.getElementById("userPost").style.display="block";
        });
    }


      return(
          <>
            <p className="noticeText">
              <br/>
              아래 버튼을 클릭하여 현위치를 표시해보세요!<br/>
              주소창 맨 왼쪽 ⓘ버튼을 누르면 빠르게 위치 정보 이용 동의를 할 수 있습니다.<br/>
              내용 입력 후 생성된 마커를 클릭하면 게시글을 확인하실 수 있어요!<br/>
              (실시간 위치 API는 크롬 브라우저의 경우 https 프로토콜만 지원합니다.
              정확한 위치를 원하신다면 크롬 외 다른 브라우저로 접속 부탁드립니다.😊)
              <br/>
            </p>
  
            <button onClick={ () => {setGetLocation(true);} }>내 위치 가져오기</button>
            <br/><br/>
            
            <div className="mapContent">
                {/* 지도 */}
                <div id="map"></div>

                {/* 입력 창 */}
                { showInput && 
                    <div className="mapInputs">
                        <label>제목 : </label>{" "}
                        <input type="text" name="title" value={title} onChange={onChangeInput}></input>
                        <br/><br/>
                        <label>내용: </label> {" "}
                        <textarea name="body" value={body} onChange={onChangeInput}></textarea>
                        <br/><br/>
                        <label>위도 : </label>{" "}
                        <span>{curLatLng[0]}</span>
                        <br/><br/>
                        <label>경도 : </label>{" "}
                        <span>{curLatLng[1]}</span>

                        <br/><br/>
                        <button onClick={()=>{console.log(userInput); setShowUserMarker(true); setShowInput(false);}}>마커 생성하기</button>
                    </div>
                }
                {/* 만약에 입력창 제출 시 - input에 있는 값으로 노란색 마커가 찍히면서 그 마커를 클릭 시 게시물 생성 */}
                {/* 시간이 된다면, 아니오 클릭 시 주소로 장소 검색하기 넣어서 거기에 마커 찍히도록 하기 */}
                <br /><br />
                
            </div>
            <div id="userPost">
                <div className="userPost_title">
                    {userInput.title}
                </div>
                <div style={{float:"right"}}>{curDate}</div>
                <br/>
                <div className="userPost_body">
                    {userInput.body}
                </div>
            </div>
            <br/><br/>
          </>
      );
  };
  
  export default CurrentGeoLocation;