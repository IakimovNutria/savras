import React from "react";

let data = [["123", "#"],
    ["321", "#"],
    ["456", "#"]]

const bgColor: string = '#000';
const textColor: string = '#fff';


const FilesStyle = {
    width: "250px",
    height: "100px",
    float: 'left' as 'left',
    padding: '42px 0 0',
    // overflowY: 'scroll' as 'scroll',
    overflowX: 'hidden' as 'hidden',
    display: 'block'
};

const UserPipelinesStyle = {
    width: "250px",
    height: "100px",
    float: 'left' as 'left',
    padding: '42px 0 0',
    // overflowY: 'scroll' as 'scroll',
    overflowX: 'hidden' as 'hidden',
    display: 'block'
};

const SharedPipelinesStyle = {
    width: "250px",
    height: "100px",
    float: 'left' as 'left',
    padding: '42px 0 0',
    // overflowY: 'scroll' as 'scroll',
    overflowX: 'hidden' as 'hidden',
    display: 'block'
};

const TextStyle = {
    width: "250px",
    height: "33px",
    background: bgColor,
    color: textColor,
    fontSize: '30px',
    fontFamily: 'Times New Roman',
    padding: '18px 0 0 21px',
    margin: '13px 0 0'
}

const UlStyle = {
    width: '250px',
    height: '129px',
    padding: '0 0 0 31px',
    background: bgColor,
    color: textColor,
    margin: '0 0 13px 0',
    listStyleType: 'none'
};

const LiStyle = {
    width: '250px',
    height: '18px',
};

const LinkStyle = {
    width: '250px',
    height: '18px',
    backgroundColor: bgColor,
    backgroundImage: 'url(images/arrow3.gif)',
    backgroundRepeat: 'no-repeat',
    color: textColor,
    fontSize: '12px',
    textDecoration: 'none',
    lineHeight: '18px',
    padding: '0 0 0 15px'
};

function Test(): JSX.Element {
    return (<html>
    <head>
        <title>Savras</title>
        <meta name="robots" content="noindex, nofollow"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </head>
    <body>
    <div className="main-page">
        <h3 style={TextStyle}>files</h3>
        <div className="files" style={FilesStyle}>
            <ul style={UlStyle}>
                {
                    data.map(key => (<li style={LiStyle}><a style={LinkStyle} href={key[1]}>{key[0]}</a></li>))
                }
            </ul>
        </div>
        <h3 style={TextStyle}>pipelines</h3>
        <div className="user-pipelines" style={UserPipelinesStyle}>
            <ul style={UlStyle}>
                {
                    data.map(key => (<li style={LiStyle}><a style={LinkStyle} href={key[1]}>{key[0]}</a></li>))
                }
            </ul>
        </div>
        <h3 style={TextStyle}>shared pipelines</h3>
        <div className="shared-pipelines" style={SharedPipelinesStyle}>
            <ul style={UlStyle}>
                {
                    data.map(key => (<li style={LiStyle}><a style={LinkStyle} href={key[1]}>{key[0]}</a></li>))
                }
            </ul>
        </div>
    </div>
    </body>
    </html>)
}

export default Test;
