#!/usr/bin/python
# coding: utf-8

from flask import Flask, request
import query
import MySQLManager
import sys
from imp import reload

reload(sys)
sys.setdefaultencoding('utf8')

app = Flask(__name__)


# 首页数据
@app.route('/mainlist', methods=['GET'])
def mainList():
    return query.mainList()



# 按类型查询作品
@app.route('/workslist', methods=['GET'])
def worksList():
    _type = request.values.get('type')
    return query.worksList(_type)


# 搜索
@app.route('/search', methods=['GET'])
def search():
    args = request.values
    name = args.get('name', '')
    pageNum = int(args.get('pageNum', '1'))
    pageSize = int(args.get('pageSize', '10'))
    return query.search(name, pageNum, pageSize)


# 访问量更新
@app.route('/calculate/visits', methods=['PUT'])
def updateVisits():
    
    try:
        values = request.json
    except:
        values = request.values

    _type = values.get('type')
    _id = values.get('id')
    
    return query.updateVisits(_id, _type)


# 资源反馈
@app.route('/feedback/resource', methods=['POST'])
def resourceFeedback():
    try:
        args = request.json
    except:
        args = request.values

    name = args.get('name')
    _id = args.get('resour_id')
    _type = args.get('type')
    message = args.get('message')
    baidu_link = args.get('baidu_link')
    bili_link = args.get('bili_link')
    mail = args.get('mail')

    return query.resourceFeedback(name, _id, _type, message, baidu_link, bili_link, mail)

@app.route('/')
def index():
    return 'This api server powered by Python.'

# 404
@app.errorhandler(404)
def page_not_found(e):
    return query.page_not_found(e, request)


#405
@app.errorhandler(405)
def method_not_allowed(e):
    return query.method_not_allowed(e, request)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8084, debug=True)