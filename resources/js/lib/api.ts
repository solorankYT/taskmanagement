import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["X-CSRF-TOKEN"] =
  (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "";

export default axios;
