import React from 'react';
import {Card} from 'antd';
import { Link,  HashRouter} from 'react-router-dom';

export default class PCNewsImgBlock extends React.Component {
    constructor() {
        super();
        this.state = {
            news: "",
            type:""
        }
    }

    componentWillMount() {

        var myFetchOptions = {
            method: 'GET'
        };
        fetch("https://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type=" +
            this.props.type + "&count=" +
            this.props.count, myFetchOptions).then(response => response.json()).then(json => {
                this.setState({news: json})
            }
        );
    }

    changeOnMouseEnter(e) {
        var x = "hover" + e;
        this.refs[x].style.color = "red";
    }

    changeOnMouseOut(e) {
        var x = "hover" + e;
        this.refs[x].style.color = "black";
    }

    render() {
        const styleImage = {
            display: "block",
            width: this.props.imageWidth,
            height: "90px"
        };
        const styleH3 = {
            width: this.props.imageWidth,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        };

        const styleP = {
            width: this.props.imageWidth,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        };
        const news = this.state.news;
        const newsList = news.length ?
            news.map((newsItem, index) => {
                return (
                    <div key={index} className={"imageblock"} onMouseEnter={this.changeOnMouseEnter.bind(this, index)}
                         onMouseLeave={this.changeOnMouseOut.bind(this, index)}>
                        <HashRouter basename="/">
                            <Link to={`details/${newsItem.realtype}/${newsItem.uniquekey}`} target="_blank">
                                <div className="custom-image">
                                    <img style={styleImage} src={newsItem.thumbnail_pic_s} alt=""/>
                                </div>
                                <div className="custom-card">
                                    <h3 ref={"hover" + index} style={styleH3}>{newsItem.title}</h3>
                                    <p style={styleP}>{newsItem.author_name}</p>
                                </div>
                            </Link>
                        </HashRouter>
                    </div>
                )
            })
            :
            "nothing";

        return (
            <div className="topNewsImgListBox">
                <Card title={this.props.cartTitle} bordered={true} style={{width: this.props.width}}>
                    <div className="topNewsImgList">
                        {newsList}
                    </div>
                </Card>
            </div>
        )
    }
}