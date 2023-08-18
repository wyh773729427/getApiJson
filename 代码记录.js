(dsf.driver.$type == 'miniapp')
//通过路由的title修改页面标题
  let pageTitle = to.meta.title || dsf.config.setting_public_default_page_title || '';
  let pageData = {
    pageTitle: pageTitle,
    path: to.path,
    name: to.name
  }
  localStorage.setItem('pageData', JSON.stringify(pageData));


Axios.interceptors.request.use

Axios.interceptors.response.use
if(response.config.url != 'http://localhost:3000/api/post') {
      let url = 'http://localhost:3000/api/post';

      let pageData = localStorage.getItem('pageData') ? JSON.parse(localStorage.getItem('pageData')) : {};
      let data = {
        pageData,
        response
      }
      post(url, JSON.stringify(data), { headers: { "content-type": "application/json" } }).done(res => {

      });
    }

