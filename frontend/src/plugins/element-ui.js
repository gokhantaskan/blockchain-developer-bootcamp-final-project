import Vue from "vue";

import {
  Alert,
  Card,
  Button,
  Dialog,
  Form,
  FormItem,
  Radio,
  RadioButton,
  RadioGroup,
  Input,
  InputNumber,
  Loading,
  MessageBox,
  Message,
  Notification,
  Tabs,
  TabPane,
  Tooltip
} from "element-ui";

Vue.use(Alert);
Vue.use(Card);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tooltip);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
