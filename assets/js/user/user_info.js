$(function () {
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname(value) {
      if (value.length > 6) {
        return "昵称的长度必须在1~6个字符之间";
      }
    },
  });

  initUserInfo();

  $(".layui-form").on("submit", function (e) {
    e.preventDefault();

    let fromData = $("#userInfoReset").serialize();
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: fromData,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("用户信息修改失败");
        } else {
          layer.msg(res.message);
          window.parent.getUserInfo();
        }
      },
    });
  });

  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });

  //初始化渲染个人信息
  function initUserInfo() {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败");
        } else {
          console.log(res.data);

          //form.val()表单快速赋值
          form.val("formUserInfo", res.data);
        }
      },
    });
  }
});
