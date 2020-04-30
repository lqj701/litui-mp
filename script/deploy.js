// #!/usr/bin/env node

// /**
//  * 小程序环境配置
//  * node deploy local
//  * node deploy dev
//  * node deploy test
//  * node deploy staging
//  * node deploy prod
//  */

// /**
//  * 环境配置参数
//  */
// const config = {
//     local: {
//         HOST: 'https://dev-yingid.ikcrm.com',
//         IMHOST: 'https://dev-im.ikcrm.com',
//         PAY_GATEWAY: 'https://dev-pay-gateway.ikcrm.com/ik-crm-pay-gateway/order/create',
//         imAccountMode: 0,
//         imSdkAppID: 1400077744,
//         imAccountType: 24256,
//         'project.config.json': {
//             "appid": "wx77d40581cbff33d6",
//             "projectname": "litui2_dev",
//         }
//     },
//     dev: {
//         HOST: 'https://dev-yingid.ikcrm.com',
//         IMHOST: 'https://dev-im.ikcrm.com',
//         PAY_GATEWAY: 'https://dev-pay-gateway.ikcrm.com/ik-crm-pay-gateway/order/create',
//         imAccountMode: 0,
//         imSdkAppID: 1400077744,
//         imAccountType: 24256,
//         'project.config.json': {
//             "appid": "wx77d40581cbff33d6",
//             "projectname": "litui2_dev",
//         }
//     },
//     test: {
//         HOST: 'https://test-yingid.ikcrm.com',
//         IMHOST: 'https://test-im.ikcrm.com',
//         PAY_GATEWAY: 'https://test-pay-gateway.ikcrm.com/ik-crm-pay-gateway/order/create',
//         imAccountMode: 0,
//         imSdkAppID: 1400081518,
//         imAccountType: 24947,
//         'project.config.json': {
//             "appid": "wxb182c7116aafebf3",
//             "projectname": "litui2_test",
//         }
//     },
//     staging: {
//         HOST: 'https://staging-yingid.ikcrm.com',
//         IMHOST: 'https://staging-im.ikcrm.com',
//         PAY_GATEWAY: 'https://staging-pay-gateway.ikcrm.com/ik-crm-pay-gateway/order/create',
//         imAccountMode: 0,
//         imSdkAppID: 1400082675,
//         imAccountType: 24948,
//         'project.config.json': {
//             "appid": "wx0828ab517e1e9fcc",
//             "projectname": "litui2_staging",
//         }
//     },
//     prod: {
//         HOST: 'https://e.ailitui.com',
//         IMHOST: 'https://im.ailitui.com',
//         PAY_GATEWAY: 'https://paygateway.hz.taeapp.com/ik-crm-pay-gateway/order/create',
//         imAccountMode: 0,
//         imSdkAppID: 1400083317,
//         imAccountType: 25050,
//         'project.config.json': {
//             "appid": "wxaaa2ccdccb1e29a2",
//             "projectname": "litui2_prod",
//         }
//     }
// }



// //------------------------
// const fs = require('fs');
// const path = require('path');
// let file = 'environment.js'

// function environment() {
//     const option = getOption();
//     const platform = config[option];

//     let content = '';
//     for (let i in platform) {
//         if (i === 'project.config.json') {
//             const projectConfig = setProjectConfig(i, platform[i]);
//             writeFile(i, projectConfig);
//             break;
//         } else {
//             content += `export const ${i} = '${platform[i]}';\n`;
//         }
//     }

//     writeFile(file, content);
// }


// function writeFile(file, content) {
//     const filePath = path.join(__dirname, file);
//     fs.writeFileSync(filePath, content);
// }

// function setProjectConfig(file, obj) {
//     const _config = serialize(readProjectConfig(file));
//     for (let i in obj) {
//         _config[i] = obj[i];
//     }

//     return JSON.stringify(_config);
// }

// function readProjectConfig(file) {
//     const filePath = path.join(__dirname, file);
//     return fs.readFileSync(filePath, 'utf8');
// }


// function serialize(str) {
//     if (!str) return {};
//     return JSON.parse(str);
// }

// function getOption() {
//     const options = process.argv;
//     for (let i in config) {
//         if (options.indexOf(i) > -1) {
//             return i;
//         }
//     }
// }

// environment();