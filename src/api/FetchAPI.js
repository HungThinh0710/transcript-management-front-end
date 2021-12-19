import axios from "axios";

const FetchAPI = (method = "UNKNOWN", endpoint = "", dataPayload = {}, page = 1, perpage = 10, params = {}) => new Promise((resolve, reject) => {
    if (method === "GET") endpoint +=`?page=${page}&perpage=${perpage}`;
    axios({
      method: method,
      params: params,
      url: endpoint,
      data: dataPayload,
      withCredentials: true
    })
      .then(function(response) {
        if (response.data.success === true) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        if(error.message !== "Request aborted"){
          reject(error.response);
        }
      });
  }
);

export { FetchAPI };
// export default FetchAPI;
