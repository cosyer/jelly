import React from 'react';
import PCHeader from './PC_header';
import PCFooter from './PC_footer';
import PCNewContainer from './PC_newscontainer';

export default class PCIndex extends React.Component {
    render() {
        return (
            <div>
                <PCHeader></PCHeader>
                <PCNewContainer/>
                <PCFooter></PCFooter>
            </div>
        );
    };
}
