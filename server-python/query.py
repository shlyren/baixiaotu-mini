#!/usr/bin/python
# coding: utf-8

import MySQLManager
import json
from flask import Response

SUCCESS_CODE = 200  # 成功
SQL_ERROR_CODE = 0  # 数据库错误
API_ERROR_CODE = -1  # 请求错误
tableNames = ['t_television', 't_television_cut']


def mainList():
    """
    获取首页数据
    """
    result_0 = MySQLManager.execute("SELECT * FROM t_television ORDER BY visits_count DESC LIMIT 6;")
    result_1 = MySQLManager.execute("SELECT * FROM t_television_cut ORDER BY visits_count DESC LIMIT 6;")

    if result_0[0] and result_1[0]:
        return wrapperResult((True, [
            {
                'title': '影视剧集',
                'type': 0,
                'items': result_0[1]
            }, {
                'title': '影视剪辑',
                'type': 1,
                'items': result_1[1]
            }
        ]))

    return wrapperResult((False, None))


def worksList(_type=None):
    """
    按类型获取作品
    :param _type: 作品类型
    :return:
    """
    index = None
    try:
        index = int(_type)
    finally:
        if -1 < index < 2:
            return query("SELECT * FROM {} ORDER BY visits_count DESC;".format(tableNames[index]))
        else:
            return wrapperResponse(API_ERROR_CODE, '无效的参数', None)


def search(name='', pageNum=1, pageSize=10):
    """
    搜索作品
    :param name: 关键字
    :param pageNum: 页数
    :param pageSize: 每页数量
    :return:
    """
    start = (pageNum - 1) * pageSize
    sql = """
        SELECT * FROM t_television WHERE title LIKE '%{}%' 
        union 
        SELECT * FROM t_television_cut WHERE title LIKE '%{}%' ORDER BY visits_count DESC LIMIT {},{};
    """.format(name, name, start, pageSize)
    return query(sql)


def updateVisits(_id, _type):
    """
    更新浏览量
    :param _id:  作品id
    :param _type:  作品类型
    :return:
    """

    print('updateVisits: id is {}, type is {}'.format(_id, _type))
    if None == _id or None == _type or not (-1 < int(_type) < 2):
        return wrapperResponse(API_ERROR_CODE, '无效的参数', None)

    table_name = tableNames[int(_type)]

    sql = """
        UPDATE {} 
        SET visits_count = visits_count + 1 
        WHERE id = {};
    """.format(table_name, table_name, _id, _id)

    return query(sql)


def resourceFeedback(name, _id, _type, message, baidu_link, bili_link, mail):
    """
    作品资源反馈
    :param name: 名称
    :param _id: 作品id
    :param _type: 作品类型
    :param message: 备注信息
    :param baidu_link:  百度网盘链接
    :param bili_link: B站连接
    :param mail: 详细方式
    :return:
    """
    if _id == None or _type is None:
        return wrapperResponse(API_ERROR_CODE, '无效的参数', None)

    sql = """
            INSERT INTO t_television_link ( name, type, resour_id, message, baidu_link, bili_link, mail ) 
            VALUES
            ('{}', {}, {}, '{}', '{}', '{}', '{}');
        """.format(name, _type, _id, message, baidu_link, bili_link, mail)

    return query(sql)


def page_not_found(error, _request):
    """
    404 not found
    错误的请求地址
    :param _request:
    :param error: 错误信息
    :return:
    """
    return wrapperResponse(404, "the path '{}' was not found".format(_request.path), '{}'.format(error))


def method_not_allowed(error, _request):
    """
    405 method not allowed
    不支持的请求方式
    :param _request:
    :param error: 错误信息
    :return:
    """
    return wrapperResponse(405, "the method '{}' was not allowed".format(_request.method), '{}'.format(error))


def query(sql):
    """
    根据sql语句查询
    :param sql: sql语句
    :return:
    """
    result = MySQLManager.execute(sql)
    return wrapperResult(result)


def wrapperResult(result):
    """
    包装查询个结果
    :param result:
    :return:
    """
    if result[0]:
        return wrapperResponse(SUCCESS_CODE, '查询成功', result[1])
    else:
        return wrapperResponse(SQL_ERROR_CODE, result[1], None)


def wrapperResponse(code, message, data):
    """
    响应体包装
    :param code: 状态码
    :param message: 状态信息
    :param data: 请求数据
    :return:
    """
    response = json.dumps({
        'code': code,
        'message': message,
        'data': data
    }, cls=CJsonEncoder)
    # 在linux中 直接返回dict 回报 TypeError: 'dict' object is not callable 
    return Response(response, mimetype='application/json')


from datetime import datetime
from datetime import date


class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)
