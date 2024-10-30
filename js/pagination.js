const styles = document.documentElement.style;
let array = [];
let array_length = 0;
const data_array = data_hanja; //hanjalist.js 불러오기
let data_array_length = data_array.length; 
let cardPerPage = 10; //화면에 출력할 card 갯수
let pageCount = Math.ceil(data_array_length / cardPerPage); //한 페이지당 출력 갯수 계산(소수점 올림)
let max_index = 0;

let start_index = 1;
let end_index = 0;
let current_index = 1;

let rows = document.querySelectorAll('.card ul li');

const prevPageBtn = document.querySelector('.index_buttons #index_prev_pageGroup');
const nextPageBtn = document.querySelector('.index_buttons #index_next_pageGroup');

let pageActiveIdx = 0; //현재 보고 있는 페이지그룹 번호
let currentPageNum = 0; //현재 보고 있는 페이지네이션 번호
let maxPageNum = 3; //페이지그룹 최대 개수

let sortCol = 'id';  //초기 배열기준 상태
let ascOrder = true;  //오름차순(ASC)로 정렬 [예, 가나다, ABC 순]

// 데이터들 값 입력
function preLoadCalculations() {
  filterList(); //filter에 추가(검색)
  sortList(); //sort에  추가

  array_length = array.length;
  max_index = parseInt(array_length / cardPerPage); //parseInt:정수로 변환
  // 데이터 인덱스 버튼 갯수
  if((array_length % cardPerPage) > 0) {
    max_index++;
  }
}

//검색기능 Filter
function filterList() {
  let search_text = $("#search_text").val();
  if(search_text != '') {
    let temp_array = data_hanja.filter(function(object) {
      return object.writing.toString().includes(search_text)
      || object.grade.toString().includes(search_text)
      || object.name.toString().includes(search_text);
    });
    array = temp_array;
    array_length = array.length;  //해당 갯수만큼 출력
  } else {  //빈칸 입력시
    array = data_hanja;
    array_length = array.length;  //원래 갯수만큼 재출력
  };
  // if 함수결과에 따른 페이지그룹 내 페이지인덱스 갯수 최대 출력
  pageCount = Math.ceil(array_length / cardPerPage);
  displayPage();  //페이지그룹 최대갯수로 표시
};

// sort 기능
function sortList() {
  array.sort((a,b) => {
    if(ascOrder) {
      return (a[sortCol] > b[sortCol]) ? 1 : -1 ;
    } else {
      return (b[sortCol] > a[sortCol]) ? 1 : -1 ;
    }
  }); //분류 위치배열순서 변경

  //sort indication
  $(".sorter > ul > li").removeClass('sort_indication');
  $(".sorter > ul > li[id = '"+sortCol+"']").addClass('sort_indication');

  if(ascOrder) {
    styles.setProperty('--up_arrow_color', '#ffffff');
    styles.setProperty('--up_arrow_shadow', '0px 0px 10px white');
    styles.setProperty('--down_arrow_color', '#ffffff49');
    styles.setProperty('--down_arrow_shadow', '0px 0px 0px rgba(255, 255, 255, 0)');
  } else {
    styles.setProperty('--up_arrow_color', '#ffffff49');
    styles.setProperty('--up_arrow_shadow', '0px 0px 0px rgba(255, 255, 255, 0)');
    styles.setProperty('--down_arrow_color', '#ffffff');
    styles.setProperty('--down_arrow_shadow', '0px 0px 10px white');
  }
};

// html의 div class="index_buttons"의 내용(+active) 생성 부분
function displayIndexButtons() {
  $(".index_buttons button").remove();
  $(".index_buttons #prev_pageGroup").append('<button type="button" onclick="prev();">&lt;</button>');
  $(".index_buttons #index_prev_pageGroup").append('<button type="button" onclick="prevPB();">...</button>');
  for(var i = 1; i <= pageCount; i++) {
    $(".index_buttons ol").append('<button type="button" onclick="indexPagination('+i+')" index="'+i+'">'+i+'</button>')
  };
  $(".index_buttons #index_next_pageGroup").append('<button type="button" onclick="nextPB();">...</button>');
  $(".index_buttons #next_pageGroup").append('<button type="button" onclick="next();">&gt;</button>');
  highlightIndexButton();
}

// html의 div class="index_buttons"의 active(+footer의 span) 부분
function highlightIndexButton() {
  start_index = ((current_index - 1) * cardPerPage) + 1;
  end_index = (start_index + cardPerPage) - 1;
  if(end_index > array_length) {
    end_index = array_length;
  };

  $(".page_footer span").text('현재 '+start_index+' ~ '+end_index+'자 | 총 '+array_length+'자');
  // 인덱스 번호
  $(".index_buttons button").removeClass('active');
  $(".index_buttons button[index='"+current_index+"']").addClass('active');

  displayTableRows();
};

//html의 ul의 li 속 내용으로 기존 코드 수정
function displayTableRows() {
  $(".card ul li").remove();  //html의 li 내용 삭제
  let tab_start = start_index - 1;
  let tab_end = end_index;

  for(var i = tab_start; i < tab_end; i++) {
    const hanja = array[i];
    const list = '<li>'+
              '<div class="card_grade"><span>'+hanja['grade']+'</span></div>'+
              '<div class="card_reading"><span>'+hanja['reading']+'</span></div>'+
              '<div class="card_writing"><span>'+hanja['writing']+'</span></div>'+
              '<div class="card_name"><span>'+hanja['name']+'</span></div>'+
              '</li>';
    
    $(".card ul").append(list);
  };
};

preLoadCalculations();  //해당 function 실행
displayIndexButtons();  // 해당 function 출력

//다음 버튼 클릭시 페이지네이션 변경 function
function next() {
  if(current_index < pageCount) {
    current_index++;
    highlightIndexButton();
  }
  // 페이지 그룹 이동시 인덱스 번호따라 동시 이동
  let nextpageNum = pageActiveIdx * maxPageNum + maxPageNum;
  if(current_index > nextpageNum) {
    nextPB();
  }
};

//이전 버튼 클릭시 페이지네이션 변경 function
function prev() {
  if(current_index > 1) {
    current_index--;
    highlightIndexButton();
  }
  let prevpageNum = pageActiveIdx * maxPageNum;
  if(current_index <= prevpageNum) {
    prevPB();
  }
};

//인덱스 버튼 클릭시 페이지네이션 변경 function
function indexPagination(index) {
  current_index = parseInt(index);
  highlightIndexButton();
};

//dropdown 숫자 선택시
$("#table_size").change(function() {
  cardPerPage = parseInt($(this).val());  //val() : 엘리먼트가 가지고 있는 value 속성(값)을 관리
  //변경시마다 페이지 그룹의 1번으로 이동_currentindex, startindex, currentpagnum
  current_index = 1;
  start_index = 1;
  currentPageNum = 0;
  pageActiveIdx = 0;
  pageCount = Math.ceil(array_length / cardPerPage);   //페이지그룹 갯수 재계산 후 출력
  displayIndexButtons();
  displayPage();  //페이지그룹 최대갯수로 표시
});

// 필터(검색기능) 버튼
$("#search_btn").click(function() {
  filterList(); //클릭시 필터기능 활성화, 상단이어야 공백없이 진행
  current_index = 1;
  start_index = 1;
  displayIndexButtons();
  displayPage();  //페이지그룹 최대갯수로 표시
});

// sort 기능
$(".sorter > ul > li").click(function() {
  let colName = $(this).attr('id');  //attr() : 엘리먼트의 속성 값을 가져오거나 변경할 수 있는 함수
  ascOrder = (sortCol == colName) ? !ascOrder : true; //삼항조건: (조건)?참:거짓;
  sortCol = colName;
  sortList(); //클릭시 function 활성화, 하단이어야 작동시 중복 클릭 최소화
  current_index = 1;
  start_index = 1;
  displayIndexButtons();
  displayPage();  //페이지그룹 최대갯수로 표시
});

/* 페이지그룹 */
//페이지네이션 그룹 표시 함수, dropdown 호환
function displayPage() {
  num = currentPageNum;
  const numberBtn = numbers.querySelectorAll('button');

  //페이지 그룹에 표시되는 번호 외 페이지네이션 번호 감추기
  for(nb of numberBtn) {
    nb.style.display = 'none';
  }
  let totalPageCount = Math.ceil(pageCount / maxPageNum);

  let pageArr = [...numberBtn];
  let start = num * maxPageNum;
  let end = start + maxPageNum;
  let pageListArr = pageArr.slice(start, end);

  for(let item of pageListArr) {
    item.style.display = '';
    if (item == 0) {
      item.style.display = 'block';
    } // 해당 if는 필터기능 사용시 인덱스번호 표시를 위함
  }
  if (pageActiveIdx == 0) { //페이지그룹이 0일때 (1,2,3 페이지묶음)
    prevPageBtn.style.display = 'none';
  } else {
    prevPageBtn.style.display = 'block';
  }
  if (pageActiveIdx == totalPageCount - 1) { //페이지그룹이 마지막 번호일때 (10 페이지묶음)
    nextPageBtn.style.display = 'none';
  } else {
    nextPageBtn.style.display = 'block';
  }
}
displayPage();  //해당 function 출력

function nextPB() {
  let nextpageNum = pageActiveIdx * maxPageNum + maxPageNum; //0*3+3
  displayPage(nextpageNum);
  ++pageActiveIdx; //1*3+3
  displayPage(pageActiveIdx);
  let maxPageGroupNum = Math.ceil(pageCount / maxPageNum) -1;
  
  if (currentPageNum < maxPageGroupNum) {
    ++currentPageNum;
  } else if (currentPageNum == maxPageGroupNum) {
    currentPageNum;
  }
  displayPage(currentPageNum);

  // 페이지그룹 이동시 현재 인덱스 번호 active 유지. 이상의 인덱스번호는 해제
  $(".index_buttons button").removeClass('active');
  $(".index_buttons button[index='"+current_index+"']").addClass('active');
}

function prevPB() {
  let prevpageNum = pageActiveIdx * maxPageNum - maxPageNum; //0*3-3 (X), 2*3-3
  displayPage(prevpageNum);
  --pageActiveIdx; //1*3-3
  displayPage(pageActiveIdx);
  
  if (currentPageNum != 0 ) {
    --currentPageNum;
  } else {
    currentPageNum;
  }
  displayPage(currentPageNum);

  // 페이지그룹 이동시 현재 인덱스 번호 active 유지. 이상의 인덱스번호는 해제
  $(".index_buttons button").removeClass('active');
  $(".index_buttons button[index='"+current_index+"']").addClass('active');
}

/* 참고
 * Youtube Channel 'Full Stack Technologies'-'JavaScript Pagination Tutorial'
 * Youtube Channel 'Rock's Easyweb'-'javascript 73~76 [테이블 페이지네이션 ] 화살표 클릭 함수'
 */