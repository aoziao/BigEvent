$(function () {
  let layer = layui.layer;
  let form = layui.form;
  laypage = layui.laypage;
  //定义一个初始化数据对象
  let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: "",
    state: "已发布",
  };

  renderArticleList();
  renderListSelect();

  //筛选按钮
  $("#form-search").on("submit", function (e) {
    e.preventDefault();

    let sname = $("#select_id").val();
    let sstate = $("#sstate").val();

    q.cate_id = sname;
    q.state = sstate;

    renderArticleList();
  });

  //渲染下拉菜单
  function renderListSelect() {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类列表失败");
        }
        console.log(res);
        let htmlStr = template("tpl-cate", res);
        $("#select_id").html(htmlStr);
        form.render();
      },
    });
  }

  //删除按钮
  $("tbody").on("click", ".btn-delete", function () {
    let len = $(".btn-delete").length;
    console.log(len);
    let id = $(this).attr("data-id");
    layer.confirm("确认是否删除?", { icon: 3, title: "提示" }, function (
      index
    ) {
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            console.log(res);
            return layer.msg(res.message);
          }
          layer.msg("删除文章分类成功");
          if (len == 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          renderArticleList();
        },
      });
      layer.close(index);
    });
  });

  //渲染列表
  function renderArticleList() {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // layer.msg("文章列表获取成功");
        template.defaults.imports.dataFormat = function (date) {
          let d = new Date(date);
          let y = reserZero(d.getFullYear());
          let m = reserZero(d.getMonth() + 1);
          let day = reserZero(d.getDate());

          let hh = reserZero(d.getHours());
          let mm = reserZero(d.getMinutes());
          let ss = reserZero(d.getSeconds());

          return y + "-" + m + "-" + day + " " + hh + ":" + mm + ":" + ss;
        };
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);

        renderPage(res.total);
      },
    });
  }

  //补零函数
  function reserZero(num) {
    return num > 10 ? num : "0" + num;
  }

  //页脚渲染
  function renderPage(total) {
    laypage.render({
      elem: "pageBox", //容器id
      count: total, //数据条数
      limit: q.pagesize, //每页显示数据
      curr: q.pagenum, //设置默认被选中的分页,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          renderArticleList();
        }
      },
    });
  }
});
