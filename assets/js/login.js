$(function () {
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  $("#link_login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  //导入模块
  let form = layui.form;
  let layer = layui.layer;

  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repwd: function (value) {
      let password = $(".reg-box [name='password']").val();
      if (value !== password) {
        return "两次密码不一致";
      }
    },
  });

  //注册发起post请求
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();

    let uname = $("#form_reg [name='username']").val();
    let upassword = $("#form_reg [name='password']").val();

    $.post("/api/reguser", { username: uname, password: upassword }, function (
      res
    ) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      } else {
        layer.msg("注册成功,请登录");
        $("#link_login").click();
      }
    });
  });

  //登录发起post请求
  $("#form_login").on("submit", function (e) {
    e.preventDefault();

    var data = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "/api/login",
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        } else {
          //   console.log("登陆成功");
          localStorage.setItem("token", res.token);
          location.href = "/index.html";
        }
      },
    });
  });
});
