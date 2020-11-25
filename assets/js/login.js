$(function () {
    // 点击去注册账号，隐藏登录区域，显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义验证规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6-16位，且不能输入空格"
        ],
        // 确认密码规则
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) {
                return "两次密码输入不一致"
            }
        }
    })

    //  注册功能

    $('#form_reg').on("submit", function (e) {
        // 阻止表单提交
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val(),
            },
            success: function (res) {
                // 返回状态判断
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提交成功后处理代码
                layer.msg("注册成功，请登录！")
                $('#link_login').click()
                $('#form_reg')[0].reset()
            }
        })
    })

    // 登录功能
    $('#form_login').on("submit", function (e) {
        // 阻止表单提交
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 返回状态判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示信息，保存token，跳转页面
                layer.msg("恭喜您，登录成功！")
                localStorage.setItem('token',res.token)
                // 跳转
                location.href = "/index.html"
            }
        })
    })
})