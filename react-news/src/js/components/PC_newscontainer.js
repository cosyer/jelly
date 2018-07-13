import React from 'react';
import {Row, Col} from 'antd';
import {Tabs, Carousel} from 'antd';
const TabPane = Tabs.TabPane;
import PCNewsBlock from './PC_news_block.js';
import PCNewsImgBlock from './PC_news_image_block';
import PCProducts from './PC_products';

export default class PCNewContainer extends React.Component {
    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            autoplay: true
        };
        return (
            <div>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20} className="container">
                        <div className="leftContainer">
                            <div className="carousel">
                                <Carousel autoplay {...settings}>
                                    <div><img src="./src/image/carousel_1.jpg"/></div>
                                    <div><img src="./src/image/carousel_2.jpg"/></div>
                                    <div><img src="./src/image/carousel_3.jpg"/></div>
                                    <div><img src="./src/image/carousel_4.jpg"/></div>
                                </Carousel>
                            </div>
                            <PCNewsImgBlock count={6} type="guoji" width="400px" cartTitle="国际头条" imageWidth="102px"/>

                        </div>

                        <Tabs className="tabs_news">
                            <TabPane tab={"新闻头条"} key="1">
                                <PCNewsBlock count={18} type="top" width="100%" bordered="false"/>
                            </TabPane>
                            <TabPane tab="国际" key="2">
                                <PCNewsBlock count={18} type="guoji" width="100%" bordered="false"/>
                            </TabPane>
                        </Tabs>

                        <Tabs defaultActiveKey="1" className="tabs_product">
                            <TabPane tab="ReactNews 产品" key="1">
                                <PCProducts />
                            </TabPane>
                        </Tabs>

                        <div>
                            <PCNewsImgBlock count={9} type="junshi" width={"1120px"} cartTitle="军事" imageWidth="102px"/>
                            <PCNewsImgBlock count={18} type="yule" width={"1120px"} cartTitle="娱乐" imageWidth="102px"/>
                        </div>
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </div>
        )
    }
}