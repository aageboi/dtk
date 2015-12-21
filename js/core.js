var posts,
    newsfeed,
    newsfeed_storage;

document.addEventListener('DOMContentLoaded', function() {
  NProgress.start();
  initStart();
});

var cb = function(data){
  alert(data.user.name);
  if (data.status) {
    l = document.querySelector(".login");
    l.innerHTML = "<p>Selamat datang, Heri gunawan";
  }
}

var initStart = function(){
  posts = document.querySelector(".posts");
  newsfeed_storage = statusHtmlStorage('newsfeed');
  
  newsfeed_storage = 0;

  $.getJSON("https://connect.detik.com/js/api/auth?callback=?", function(data) {

    // console.log(data);
    // alert(data.user.email);

    // alert(data.user.name);
    if (data.status) {
      l = document.querySelector(".login");
      console.log('name '+data.user.name);
      l.innerHTML = "<p>Selamat datang, "+data.user.name;
    }
  });

  if (newsfeed_storage == 0) {
    $.getJSON("https://apis.detik.com/v1/newsfeed", function(posts) {
      if (posts.success) {
        newsfeed = posts.data.nonheadline;
        console.log('total: '+newsfeed.length);
        setHtmlStorage('newsfeed', JSON.stringify(newsfeed), 300);

        // alert(newsfeed.length);

        for (var i = 0;i < newsfeed.length;i++){
          addNewsFeed(newsfeed[i]);
          console.log('i '+i);
          if (i == 9){
            console.log(i);
            setTimeout(function(){ NProgress.done()}, 2000)
          }
        }
      }
    });

  } else {
    newsfeed = JSON.parse(localStorage.getItem('newsfeed'));
    console.log('total storage: '+newsfeed.length);
    for (var i = 0;i < newsfeed.length;i++){
      addNewsFeed(newsfeed[i]);
      console.log('i storage: '+i);
      if (i == 9){
        console.log('storage '+i);
        setTimeout(function(){ NProgress.done()}, 2000)
      }
    }
  }
}

var addNewsFeed = function(post) {
  var postDom = document.createElement("div");
  postDom.classList.add("post");

  postDom.innerHTML += "<h3><a href='"+post.url+"' target='_blank'>"+post.title+"</h3>";
  postDom.innerHTML += "<small>" + post.date_published + " WIB</small>";
  postDom.innerHTML += "<p>" + post.resume + "</p>";
  postDom.innerHTML += "<span class='avatar'> <img src='"+post.image.replace('http://','https://')+"?w=150'></span>";

  posts.insertBefore(postDom, posts.firstChild);
}

function removeStorage(name) {
  localStorage.removeItem(name);
  localStorage.removeItem(name+'_time');
}

function setHtmlStorage(name, value, expires) {
  if (expires == undefined || expires == 'null') { var expires = 3600; }

  var date = new Date();
  var schedule = Math.round((date.setSeconds(date.getSeconds()+expires))/1000);
  localStorage.setItem(name, value);
  localStorage.setItem(name+'_time', schedule);
}

function statusHtmlStorage(name) {
  var date = new Date();
  var current = Math.round(+date/1000);

  // Get Schedule
  var store_time = localStorage.getItem(name+'_time');
  if (store_time == undefined || store_time == 'null') { var store_time = 0; }
  if (store_time < current) {
    removeStorage(name);
    return 0;
  } else {
    return 1;
  }

}
