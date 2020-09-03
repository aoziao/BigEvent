$(function () {

  let layer = layui.layer;
  let form = layui.form;

  renderArticleCate();
  
  let indexAdd = null;
  let indexEdit = null;
  let indexDel = null;

  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      title: "添加文章分类",
      type: 1,
      area: ["500px", "250px"],
      content: $("#dialog-add").html(), //这里content是一个普通的String
    });
  });

  //增加分类
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        } else {
          renderArticleCate();
          layer.msg(res.message);
          layer.close(indexAdd);
        }
      },
    });
  });

  //编辑按钮---修改分类弹出层
  $("tbody").on("click", ".btn-edit", function () {
    indexEdit = layer.open({
      title: "修改文章分类",
      type: 1,
      area: ["500px", "250px"],
      content: $("#dialog-edit").html(), //这里content是一个普通的String
    });

    let id = $(this).attr("data-id");
    $.ajax({
      type: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        form.val("form-edit", res.data);
      },
    });
  });

  //修改提交
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("更新文章分类信息成功");
        renderArticleCate();
        layer.close(indexEdit);
      },
    });
  });

  //删除修改
  $("tbody").on("click", ".btn-delete", function () {
    let id = $(this).attr("data-id");   
    indexDel = layer.confirm(
      "确认是否删除?",
      { icon: 3, title: "提示" },
      function (index) {
        $.ajax({
          type: "GET",
          url: "/my/article/deletecate/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg(layer.message);
            }
            layer.msg("删除文章分类信息成功");
            renderArticleCate();
            layer.close(indexDel);
          },
        });

        layer.close(index);
      }
    );
  });

  //渲染
  function renderArticleCate() {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res);

        let tmpHtml = template("tpl-table", res);

        $(".layui-table tbody").empty().html(tmpHtml);
      },
    });
  }
});
