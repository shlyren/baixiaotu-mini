#!/usr/bin/python
# coding: utf-8

import pymysql
import json
import platform


def mysql_config_path():
    """
    根据平台查询mysq配置文件
    :return:
    """
    platform = platform.system()
    print('当前平台为：{}'.format(platform))
    mysql_config = None
    if platform == 'Darwin':
        mysql_config = "/Users/yuxiang/Documents/Developer/WeChat/baixiaotu-mini/sqlconfig.json"
    elif platform == 'Linux':
        mysql_config = "/root/swift/baixiaotu.json"
    else:
        print('请设置mysql配置文件路径')
    
    print(mysql_config)
    return mysql_config


# 加载mysql 配置文件
with open(mysql_config_path()) as text:
    config = json.load(text)
    print(config)
    if config['mysql']:
        config = config['mysql']
        
    host = config['host']
    user = config['user']
    password = config['password']
    database = config['database']


def execute(sql):
    """
    查询个数据
    :param sql:
    :return:
    """
    # 建立连接
    conn = pymysql.connect(
        host=host,
        port=3306,
        user=user,
        password=password,
        database=database,
        charset="utf8"
    )

    print(sql)
    try:
        # 获取一个光标
        cursor = conn.cursor()
        # 拼接并执行SQL语句
        cursor.execute(sql)
        result = cursor.fetchall()
    except Exception as e:
        print(e)
        return False, '{}'.format(e)

    # 涉及写操作注意要提交
    conn.commit()

    # 关闭连接
    cursor.close()
    conn.close()

    return True, result
