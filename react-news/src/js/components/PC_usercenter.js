import React from 'react';

import {Row, Col, Tabs, Upload, Icon, Modal, Card} from 'antd';

const TabPane = Tabs.TabPane;
import PCHeader from './PC_header';
import PCFooter from './PC_footer';

export default class PCUserCenter extends React.Component {
    constructor() {
        super();
        this.state = {
            usercollection: '',
            usercomments: '',
            previewImage: '',
            previewVisible: false,
            newsItem:''
        };
    };

    componentDidMount(){
        var myFetchOption = {
            method : 'GET'
        }

        fetch('https://newsapi.gugujiankong.com/Handler.ashx?action=getuc&userid=' + localStorage.userid,myFetchOption)
            .then(response => response.json())
            .then(json=>{

                this.setState({
                    usercollection:json
                })
            });

        fetch("https://newsapi.gugujiankong.com/Handler.ashx?action=getusercomments&userid=" + localStorage.userid, myFetchOption)
            .then(response => response.json())
            .then(json => {
                this.setState({usercomments:json});
            });

    }

    render() {
        const props = {
            action: 'https://newsapi.gugujiankong.com/handler.ashx',
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            listType: 'picture-card',
            defaultFileList: [
                {
                    uid: -1,
                    name: 'xxx.png',
                    state: 'done',
                    url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
                    thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png'
                }
            ],
            onPreview: (file) => {
                this.setState({previewImage: file.url, previewVisible: true});
            }
        };

        const {usercollection,usercomments} = this.state;
        const usercollectionList = usercollection.length ?
            usercollection.map((uc,index)=>(
                <Card key={index} title={uc.uniquekey} extra={<a target="_blank" href={`/#/details/${uc.newstype}/${uc.uniquekey}`}>查看</a>}>
                    <p>{uc.Title}</p>
                </Card>
            ))
            :
            "您还没有收藏任何新闻，快去收藏吧！！！";

            const usercommentsList = usercomments.length ?
                usercomments.map((comment,index)=>(
                    <Card key={index} title={'于 '+comment.datetime+' 评论了文章 '+comment.uniquekey}
                          extra={<a target="_blank" href={`/#/details/${this.state.newsType}/${comment.uniquekey}`}>查看</a>} >
                        <p>{comment.Comments}</p>
                    </Card>
                ))
                :
                '您还没有评论任何内容';


        return (
            <div>
                <PCHeader></PCHeader>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}>
                        <Tabs>
                            <TabPane tab={"我的收藏列表"} key={"1"}>
                                <div className={"comment"}>
                                    <Row>
                                        <Col span={24}>
                                            {usercollectionList}
                                        </Col>
                                    </Row>
                                </div>
                            </TabPane>
                            <TabPane tab={"我的评论列表"} key={"2"}>
                                <div class="comment">
                                    <Row>
                                        <Col span={24}>
                                            {usercommentsList}
                                        </Col>
                                    </Row>
                                </div>
                            </TabPane>
                            <TabPane tab={"头像设置"} key={"3"}>
                                <div className={"clearfix"}>
                                    <Upload {...props}>
                                        <Icon type={"plus"}></Icon>
                                        <div className={"ant-upload-text"}>上传照片</div>
                                    </Upload>
                                    <Modal visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({previewVisible: false})}>
                                        <img alt="预览" src={this.state.previewImage}/>
                                    </Modal>
                                </div>

                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={2}></Col>
                </Row>
                <PCFooter></PCFooter>
            </div>
        )
    }
}