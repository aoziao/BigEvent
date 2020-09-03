$(function () {
  let layer = layui.layer;
  let form = layui.form;

  renderArticleSelect();
  //渲染下拉列表分类
  function renderArticleSelect() {
    $.ajax({
      type: "GEt",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章列表失败");
        }
        // console.log(res);
        let htmlStr = template("tpl-cate", res);
        $("#seclect-options").html(htmlStr);
        form.render();
      },
    });
  }
  //实现基本裁剪效果：
  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //选择封面
  $("#btnChooseImage").on("click", function () {
    $(this).siblings("#coverFile").click();
  });

  $("#coverFile").on("change", function (e) {
    var file = e.target.files;
    if (file.length <= 0) {
      return layer.msg("未选择任何图片");
    }
    //更换裁剪的图片

    //根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file[0]);
    //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //监听state状态
  var pub_state = "已发布";
  $("#btnSave2").on("click", function () {
    pub_state = "草稿";
  });

  //监听表单的submit事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();

    //设定初始值

    //设定formData对象
    let fd = new FormData($("#form-pub")[0]);
    fd.append("state", pub_state);
    // 将裁剪后的图片，输出为文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append("cover_img", blob);
        publishArticle(fd);
      });

    //发表文章
  });

  function publishArticle(fd) {
    $.ajax({
      type: "POST",
      url: "/my/article/add",
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("文章发表失败");
        } else {
          layer.msg("发表文章成功, 即将跳转文章列表");
          setTimeout(() => {
            location.href = "../../../article/art_list.html";
          }, 2000);
        }
      },
    });
  }
});
