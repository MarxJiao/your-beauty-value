/**
 * @file 获取 access token
 * @author Marx
 */


const axios = require('axios');

const {clintId, clientSecret} = process.env;

module.exports = function () {
    return axios.get(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${clintId}&client_secret=${clientSecret}`).then(res => res.data.access_token);
};
