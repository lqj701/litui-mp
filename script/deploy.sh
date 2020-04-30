# chmod +x deploy.sh 
# 需要手动在微信开发工具中勾选 -> 启动自定义处理命令选项

devConf="
export const HOST = 'https://dev-yingid.ikcrm.com';
export const IMHOST = 'https://dev-im.ikcrm.com';
export const PAY_GATEWAY = 'https://dev-pay-gateway.ikcrm.com/ik-crm-pay-gateway/order/create';
export const imAccountMode = 0;
export const imSdkAppID = 1400077744;
export const imAccountType = 24256;
"
testConf="
export const HOST = 'https://test-yingid.ikcrm.com';
export const IMHOST = 'https://test-im.ikcrm.com';
export const PAY_GATEWAY = 'https://test-pay-gateway.ikcrm.com/ik-crm-pay-gateway/order/create';
export const imAccountMode = 0;
export const imSdkAppID = 1400081518;
export const imAccountType = 24947;
"
stagingConf="
export const HOST = 'https://staging-yingid.ikcrm.com';
export const IMHOST = 'https://staging-im.ikcrm.com';
export const PAY_GATEWAY = 'https://staging-pay-gateway.ikcrm.com/ik-crm-pay-gateway/order/create';
export const imAccountMode = 0;
export const imSdkAppID = 1400082675;
export const imAccountType = 24948;
"
prodConf="
export const HOST = 'https://e.ailitui.com';
export const IMHOST = 'https://im.ailitui.com';
export const PAY_GATEWAY = 'https://paygateway.hz.taeapp.com/ik-crm-pay-gateway/order/create';
export const imAccountMode = 0;
export const imSdkAppID = 1400083317;
export const imAccountType = 25050;
"

dev=wx77d40581cbff33d6
test=wx77d40581cbff33d6
staging=wx77d40581cbff33d6
prod=wx77d40581cbff33d6

if test $1 == dev
    then
    echo $devConf > environment.js
elif test $1 == test
    then
    echo $testConf > environment.js
elif test $1 == staging
    then
    echo $stagingConf > environment.js
else
    echo $prodConf > environment.js
fi
