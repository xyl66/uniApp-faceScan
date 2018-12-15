const webConfig={
	apiUrl: 'https://csp.foxconn.com/HRApi'
}
/**
 * 根据状态码得到提示信息
 * @param {string} code  状态码
 */
const getCodeToMsg = function (code){
  var result = ''
  switch (code){
    case 'NOTEL': result='该手机号暂未注册!';
    break;
    case 'NOUSER': result='没有对应用户信息';
    break;
    case 'ACTIVECODEERR': result='验证码错误';
    break;
    case 'UNAUTHENTICATED': result='未实名认证';
    break;
    case 'NOSIGNER': result='没有对应待签核记录';
    break;
    case 'NODOC': result='没有对应签核文档';
    break;
    case 'NOFILEIMAGE': result='没有档案图档';
    break;
    case 'IMAGEERROR': result='图像识别错误';
    break;
    case 'IDCARDINVALID': result='身份证不合法';
    break;
    case 'INFOERROR': result='与注册信息不符，姓名不匹配';
    break;
    case 'IDCARDCONFLICT': result='与注册信息不符，证件号码不匹配';
    break;
    case 'HANDWRINGTERR': result='签名不符';
    break;
    case 'HANDWRINGFAIL': result='识别错误';
    break;
    case 'FACEIMGERROR': result='人脸图像错误';
    break;
    case 'FACEMATCHERROR ': result='人脸匹配失败';
    break;
    case 'SIGNERROR  ': result='签核错误';
    break;
    case 'DBERROR ': result='更新数据错误';
    break;
    default: result='未知错误'+code;
  }
  return result
}
export default {webConfig,getCodeToMsg}