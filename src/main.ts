import App from "./App.svelte";

const TOKEN = "";
const MY_LOGIN = "celinelouvet";
const MY_TEAM = "user-success";
const organization = "shinetools";

const app = new App({
  target: document.body,

  props: {
    token: TOKEN,
    username: MY_LOGIN,
    team: MY_TEAM,
    organization,
  },
});

export default app;
