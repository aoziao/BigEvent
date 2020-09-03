$(function () {
  getUserInfo();

  //点击退出
  $("#btnLogOut").on("click", function (e) {
    e.preventDefault();

    layer.confirm("确认退出登录?", { icon: 3, title: "提示" }, function (
      index
    ) {
      //do something
      localStorage.removeItem("token");
      location.href = "../../login.html";
      layer.close(index);
    });
  });

  //渲染个人信息
});

//获取个人信息
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status !== 0) {
        //   console.log(res.message);
        return layer.msg(res.message);
      } else {
        //   console.log(res.data);
        renderUserInfo(res.data);
      }
    },
  });
}

function renderUserInfo(data) {
  let name = data.nickname || data.username;
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);

  if (data.user_pic !== null) {
    $(".layui-nav-img").attr("src", data.user_pic).show();
    $(".text-avatar").hide();
  } else {
    htmlStr = name[0].toUpperCase();
    $(".text-avatar").html(htmlStr).show();
    $(".layui-nav-img").hide();
  }
}
