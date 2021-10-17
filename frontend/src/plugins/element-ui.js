import Vue from "vue";

import {
  Card,
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  InputNumber,
  Loading,
  MessageBox,
  Message,
  Notification
} from "element-ui";

Vue.use(Card);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(InputNumber);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
