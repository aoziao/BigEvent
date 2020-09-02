$(function () {
  let layer = layui.layer;
  //获取裁剪区的Dom元素
  var $image = $("#image");

  //配置选项
  const options = {
    //纵横比
    aspectRatio: 1,
    //指定预览区域
    preview: ".img-preview",
  };

  //创建裁剪区域
  $image.cropper(options);

  //文件选择框绑定change事件

  $("#btnChooseImage").on("click", function (e) {
    e.preventDefault();

    $("#file").click();
  });

  $("#file").on("change", function (e) {
    //拿到用户选择的文件
    let fileLsit = e.target.files[0];

    if (fileLsit.length === 0) {
      return layer.msg("请选择图片");
    }
    //根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(fileLsit);

    //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  $("#btnUpload").on("click", function (e) {
    e.preventDefault();
    // 将裁剪后的图片，输出为 base64 格式的字符串
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // console.log(dataURL);

    $.ajax({
      type: "POST",
      url: "/my/update/avatar",
      data: { avatar: dataURL },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("图像上传失败");
        }
        layer.msg(res.message);
        window.parent.getUserInfo();
      },
    });
  });
});
