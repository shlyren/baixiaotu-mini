// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const axios = require('axios');

// 需要加此配置 否则报错 unable to verify the first certificate
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0


// 云函数入口函数
exports.main = async (event, context) => {
  const { 
    url, 
    method = 'GET', 
    data, 
    baseURL = 'https://api.baixiaotu.cc/'
    } = event;

  try {
    const response = await axios({
      baseURL,
      url,
      method,
      data,
      responseType: 'json'
    })
    return response.data
  } catch (error) {
    return {
      code: 0,
      message: error.message,
      data: error
    }
  }

}