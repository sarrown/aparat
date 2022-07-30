const modal = document.getElementById("videoModal");
const closeBtn = document.getElementById("close");
const modalIframe = document.getElementById("modalIframe");

closeBtn.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

let skip = 0;
let currentPage = 1;
function nextPageHandler() {
  skip = skip + 6;
  currentPage = currentPage + 1;
  getVideosHandler();
}
function prevPageHandler() {
  skip = skip - 6;
  currentPage = currentPage - 1;
  getVideosHandler();
}

function getVideosHandler() {
  const inputVal = document.getElementById("search").value;
  const videoPart = document.getElementById("videoPart");
  let child = videoPart.lastElementChild;
  while (child) {
    videoPart.removeChild(child);
    child = videoPart.lastElementChild;
  }
  axios
    .get(
      `https://www.aparat.com/etc/api/videoBySearch/text/${inputVal}/perpage/6/curoffset/${skip}`
    )
    .then((res) => {
      const videos = res.data.videobysearch;
      showVideosHandler(videos);
    });
}

function showVideosHandler(videos) {
  const videoPart = document.getElementById("videoPart");
  videos.map((video) => {
    const parentDiv = document.createElement("div");
    parentDiv.setAttribute("class", "box");
    parentDiv.setAttribute("id", `box${video.uid}`);
    const publisher = document.createElement("p");
    publisher.setAttribute("id", `p${video.uid}`);
    parentDiv.appendChild(publisher);
    const img = document.createElement("img");
    img.setAttribute("class", "inner-box");
    img.setAttribute("id", `innerBox${video.uid}`);
    const videoModel = {
      poster:video.big_poster,
      url: video.frame,
      username: video.username,
      uid: video.uid,
    };
    img.setAttribute("src", videoModel.poster);
    img.setAttribute("data-id", videoModel.uid);
    publisher.innerText = videoModel.username;
    parentDiv.appendChild(img);
    videoPart.insertAdjacentElement("afterbegin", parentDiv);
    mouseOverHandler(img, videoModel.uid);
    mouseLeaveHandler(parentDiv, videoModel.uid);
    modalHandler(parentDiv, videoModel);
  });
}

function mouseOverHandler(element, videoId) {
  element.addEventListener("mouseover", () => {
    document.getElementById(`innerBox${videoId}`).style.display = "none";
  });
}

function mouseLeaveHandler(element, videoId) {
  element.addEventListener("mouseleave", () => {
    document.getElementById(`innerBox${videoId}`).style.display = "block";
  });
}

function modalHandler(element, video, isSave = true) {
  element.addEventListener("click", () => {
    modal.style.display = "block";
    modalIframe.setAttribute("src", video.url);
    axios
      .get(`https://www.aparat.com/etc/api/profile/username/${video.username}`)
      .then((res) => {
        const profileName = res.data.profile.name;
        const profilePicture = res.data.profile.pic_m;
        const text = document.getElementById("profileName");
        const img = document.getElementById("profilePic");
        text.innerText = `username: ${profileName}`;
        img.setAttribute("src", profilePicture);
      });
    if (isSave) videoViewHandler(video);
    showVisit(video);
  });
}
function videoViewHandler(video) {
  const videoViews = localStorage.getItem('count') ? JSON.parse(localStorage.getItem('count')) : []; 
  const playedVideo = {
    id: video.uid,
    count: 1,
  };
  const doseVideoExist = videoViews.some((view) => view.id === video.uid);
  const index = videoViews.findIndex(
    (videoIndex) => videoIndex.id === video.uid
  );
  if (!doseVideoExist) {
    videoViews.push(playedVideo);
  } else {
    videoViews[index].count = videoViews[index].count + 1;
  }
  localStorage.setItem('count',JSON.stringify(videoViews))
}
function showVisit(video){
  const visitHolder = document.getElementById("visit");
  const indexOfElement = JSON.parse(localStorage.count);
  const viewCounter = indexOfElement.find((el) => video.uid === el.id);
  visitHolder.innerHTML = ` number of our visits: ${viewCounter.count}`;
}