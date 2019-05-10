import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { MdMenu, MdClose, MdEventBusy } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Banner.scss');

interface MessageLink {
    type: String,
    url: String
}

interface BannerMessage {
    needsBanner: Boolean,
    message: String,
    type: String,
    alertType: String,
    hasLink: Boolean,
    link?: MessageLink
}

interface Banner {
    isOpen?: Boolean,
    alertType?: String
}

const Banner = ( {isOpen, alertType } : Banner) => {
    
    var [opened, setIsOpen] = useState<Boolean>(isOpen);
    const [alert] = useState(alertType);
    const [message, setMessage] = useState('');
    //var Opened = props.isOpen;

    const setAlertType = (type : String) => {
        switch(type) {
            case 'alert':
                return styles.banner + " " + styles.alert;
            case 'action':
                return styles.banner + " " + styles.action;
            case 'warning':
                return styles.banner + " " + styles.warning;
            default:
                return styles.banner + " " + styles.alert;

        }
    }

    ipcRenderer.on('bannermessage', function(event, args) {
        var bannerMessage = args[0] as BannerMessage
        if (bannerMessage.needsBanner == true) {
            setIsOpen(true);
            setMessage(bannerMessage.message as string);
            setAlertType(bannerMessage.alertType);
        }
    });

    return (
        <div className={`${setAlertType(alert)} ${opened ? styles.opened : styles.closed}`} >
            <div className={`${styles.bannerItem} ${styles.content}`}>
                <div>{message}</div>
            </div>
            <MdClose className={`${styles.bannerItem} ${styles.closeBtn}`}  onClick={() => {
                setIsOpen(false);
            }} />
        </div>);
};

export { Banner };