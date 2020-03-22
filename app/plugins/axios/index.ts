import { PluginType } from '../../plugin';
import axios from 'axios';

export const initWebApp = function (params: PluginType) {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        console.log(`\n\n----->${JSON.stringify(config)}\n\n`);
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Do something with response data
        console.log(`\n\n----->${response}\n\n`);
        return response;
    }, function (error) {
        // Do something with response error
        return Promise.reject(error);
    });
};
