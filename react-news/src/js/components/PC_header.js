import React from 'react';
import {Row, Col,Menu, Icon, Tabs, message, Form, Input, Button,  Modal} from 'antd';


const FormItem = Form.Item;
const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;

import { Link, HashRouter} from 'react-router-dom'

class PCHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            current: "top",
            modalVisible: false,
            action: 'login',
            hasLogined: false,
            userNickName: "",
            userId: 0
        }
    };

    setModalVisible(value) {
        this.setState({modalVisible: value});
    };

    componentWillMount() {
        if (localStorage.userid != '') {

            this.setState({hasLogined: true});
            this.setState({userNickName: localStorage.userNickName, userid: localStorage.userid});
        }
    };

    handleSubmit(e) {

        //页面开始想 API 进行数据交换
        e.preventDefault();
        var myFetchOptions = {
            method: 'GET'
        };
        var formData = this.props.form.getFieldsValue();


        fetch("https://newsapi.gugujiankong.com/Handler.ashx?" +
            "action=" + this.state.action +
            "&username=" + formData.userName +
            "&password=" + formData.password +
            "&r_userName=" + formData.r_userName +
            "&r_password=" + formData.r_password +
            "&r_confirmPassword=" + formData.r_confirmPassword,
            myFetchOptions)
            .then(response => response.json())
            .then(json => {
                this.setState({userNickName: json.NickUserName, userid: json.UserId});

                localStorage.userid = json.UserId;
                localStorage.userNickName = json.NickUserName;
            });
        if (this.state.action == "login") {
            this.setState({hasLogined: true});
        }
        message.success("请求成功！");
        this.setModalVisible(false);
    };

    handleClick(e) {
        if (e.key == "register") {
            // this.setState({current:"register"});
            this.setModalVisible(true);
        } else {
            this.setState({
                current: e.key
            })
        }

    };

    callback(key) {
        if (key == 1) {
            this.setState({
                action: 'login'
            })
        } else if (key == 2) {
            this.setState({
                action: 'register'
            })
        }
    }

    logout() {
        localStorage.userid = '';
        localStorage.userNickName = '';
        this.setState({hasLogined: false});
    };

    render() {
        let {getFieldProps} = this.props.form;
        const userShow = this.state.hasLogined ?
            <MenuItem key="logout" className="register">
                <Button type="primary" htmlType="button">{this.state.userNickName}</Button>
                &nbsp;&nbsp;
                <HashRouter basename="/">
                    <Link to={`PCUserCenter/`} target="_blank">
                        <Button type="dashed" htmlType="button">个人中心</Button>
                    </Link>
                </HashRouter>
                &nbsp;&nbsp;
                <Button type="ghost" htmlType="button" onClick={this.logout.bind(this)}>退出</Button>
            </MenuItem>
            :
            <MenuItem key="register" className="register">
                <Icon type="appstore"/>注册/登陆
            </MenuItem>;
        return (
            <header>
                <Row>
                    <Col span={2}></Col>
                    <Col span={4}>
                        <a href="#" className="logo">
                            <img src="./src/image/logo.png" alt="logo"/>
                            <span>Hot News</span>
                        </a>
                    </Col>
                    <Col span={16}>
                        <Menu mode="horizontal" selectedKeys={[this.state.current]}
                              onClick={this.handleClick.bind(this)}>
                            <Menu.Item key="top">
                                <Icon type="appstore"/>头条
                            </Menu.Item>
                            <Menu.Item key="shehui">
                                <Icon type="appstore"/>社会
                            </Menu.Item>
                            <Menu.Item key="guonei">
                                <Icon type="appstore"/>国内
                            </Menu.Item>
                            <Menu.Item key="guoji">
                                <Icon type="appstore"/>国际
                            </Menu.Item>
                            <Menu.Item key="tiyu">
                                <Icon type="appstore"/>体育
                            </Menu.Item>
                            <Menu.Item key="junshi">
                                <Icon type="appstore"/>军事
                            </Menu.Item>
                            <Menu.Item key="keji">
                                <Icon type="appstore"/>科技
                            </Menu.Item>
                            {userShow}
                            <Modal title="用户中心" wrapClassName="vertical-center-modal" visible={this.state.modalVisible}
                                   onOk={() => this.setModalVisible(false)} onText="关闭"
                                   onCancel={() => this.setModalVisible(false)}>
                                <Tabs type="card" onChange={this.callback.bind(this)}>
                                    <TabPane tab={"登陆"} key={"1"}>
                                        <Form layout={"horizontal"} onSubmit={this.handleSubmit.bind(this)}>
                                            <FormItem label="账户">
                                                <Input type="text"
                                                       placeholder="请输入您的账号" {...getFieldProps("userName")} />
                                            </FormItem>
                                            <FormItem label={"密码"}>
                                                <Input type="password"
                                                       placeholder="请输入您的密码" {...getFieldProps("password")} />
                                            </FormItem>
                                            <Button type="primary" htmlType="submit">登陆</Button>
                                        </Form>
                                    </TabPane>
                                    <TabPane tab={"注册"} key={"2"}>
                                        <Form layout={"horizontal"} onSubmit={this.handleSubmit.bind(this)}>
                                            <FormItem label="账户">
                                                <Input type="text"
                                                       placeholder="请输入您的账号" {...getFieldProps("r_userName")} />
                                            </FormItem>
                                            <FormItem label={"密码"}>
                                                <Input type="password"
                                                       placeholder="请输入您的密码" {...getFieldProps("r_password")} />
                                            </FormItem>
                                            <FormItem label={"确认密码"}>
                                                <Input type="password"
                                                       placeholder="请再次输入您的密码" {...getFieldProps("r_confirmPassword")} />
                                            </FormItem>
                                            <Button type="primary" htmlType="submit">注册</Button>
                                        </Form>
                                    </TabPane>
                                </Tabs>
                            </Modal>
                        </Menu>
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </header>
        )
    };
}

export default PCHeader = Form.create({})(PCHeader);