import moment from "moment";
import _ from "lodash";

const formatDate = (date) => {
  return moment(date).toISOString();
};

const formatNumber = (number = 0) => {
  return parseInt(number)?.toLocaleString();
};
const formatMoney = (number = 0) => {
  return parseInt(number)?.toLocaleString() + " đ";
};

const parseJwt = (token) => {
  var base64Url = _.split(token, ".")[1];
  // var base64Url = token.split(".")[1];
  var base64 = _.replace(base64Url, /-/g, "+");
  var base64_1 = _.replace(base64, /_/g, "/");
  // var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64_1)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

// lay giá trị parse thành object
const localparseJson = (localString) => {
  if (localString) return JSON.parse(localString);
  else return "";
};

const getAccessToken = (localString) => {
  if (localString) return localparseJson(localString).accessToken;
  else return "";
};

const parseAccessToken = (localString) => {
  if (localString) return parseJwt(getAccessToken(localString));
  else return "";
};

const parseAccessToken_res = (data) => {
  if (data) return parseJwt(data.accessToken);
  else return "";
};
const changeTailURL = (URL) => {
  var URL_ = URL.split(".");
  URL_[URL_.length - 1] = "jpeg";
  return (URL_ = URL_.join("."));
};

const parseForm = (values) => {
  let formData = new FormData();
  for (const key in values) formData.append(key, values[key]);
  return formData;
};
export {
  formatDate,
  formatNumber,
  parseJwt,
  localparseJson,
  getAccessToken,
  parseAccessToken,
  parseAccessToken_res,
  formatMoney,
  changeTailURL,
  parseForm,
};
