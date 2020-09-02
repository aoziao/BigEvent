$(function () {
  let form = layui.form;
  let layer = layui.layer;

  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: function (value) {
      let password = $("[name='oldPwd']").val();
      if (value === password) {
        return "新旧密码不能相同";
      }
    },
    rePwd: function (value) {
      let password = $("[name='newPwd']").val();
      if (value !== password) {
        return "两次密码不一致";
      }
    },
  });

  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "/my/updatepwd",
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        } else {
          layer.msg(res.message);
          //重置表单
          $("[type='reset']").click();
        }
      },
    });
  });
});
