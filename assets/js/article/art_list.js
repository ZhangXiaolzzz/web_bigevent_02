$(function () {
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage
    // 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + "-" + m + "-" + d + "" + hh + ":" + mm + ":" + ss

    }

    // 在个位的左侧填充 0
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }
    // 定义提交参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: "",
    }

    // 初始化文章列表
    initTable()

    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                var str = template("tpl-table", res)
                $("tbody").html(str)
                renderPage(res.total)
            }
        })
    }

    // 初始化分类
    initCate()
    // 封装
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // 校验
                if (res.status !== 0) {
                    return layer.mag(res.message)
                }
                // 赋值
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }


    // 筛选功能
    $("#form-search").on('submit', function (e) {
        e.preventDefault()
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        q.state = state
        q.cate_id = cate_id
        initTable()
    })

    // 分页 
    function renderPage(total) {
        // alert(num)
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,

            // 分页模块设置
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 触发jump ： 分页初始化的时候，页码改变的时候
            jump: function (obj, first) {
                // console.log(first, obj.curr, obj.limit);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });

    }

    // 删除

    $("tbody").on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm("是否确认删除?", {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功!')
                    // 页面汇总删除按钮个数等于1，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                    // 因为我们更新成功了，所以要重新渲染页面中的数据
                    initTable()
                }
            })
            layer.close(index)
        })
    })


})