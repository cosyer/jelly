import React from 'react';
import MobileHeader from './mobile_header';
import MobileFooter from './mobile_footer';
import MobileList from './mobile_list';
import {Tabs, Carousel} from 'antd';

const TabPane = Tabs.TabPane;
export default class MobileIndex extends React.Component {
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
                <MobileHeader></MobileHeader>
                <Tabs>
                    <TabPane tab="新闻首页" key={"1"}>
                        <div className="carousel">
                            <Carousel {...settings}>
                                <div><img src="./src/image/carousel_1.jpg"/></div>
                                <div><img src="./src/image/carousel_2.jpg"/></div>
                                <div><img src="./src/image/carousel_3.jpg"/></div>
                                <div><img src="./src/image/carousel_4.jpg"/></div>
                            </Carousel>
                        </div>
                        <MobileList count={20} type="top"/>
                    </TabPane>
                    <TabPane tab="社会" key={"2"}>
                        <MobileList count={20} type="shehui"/>
                    </TabPane>
                    <TabPane tab="国内" key={"3"}>
                        <MobileList count={20} type="guonei"/>
                    </TabPane>
                    <TabPane tab="国际" key={"4"}>
                        <MobileList count={20} type="guoji"/>
                    </TabPane>
                    <TabPane tab="体育" key={"5"}>
                        <MobileList count={20} type="tiyu"/>
                    </TabPane>
                    <TabPane tab="军事" key={"6"}>
                        <MobileList count={20} type="junshi"/>
                    </TabPane>
                    <TabPane tab="科技" key={"7"}>
                        <MobileList count={20} type="keji"/>
                    </TabPane>
                </Tabs>
                <MobileFooter/>
            </div>
        )
    }
}