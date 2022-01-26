import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const generateIcon = (title) => {
    switch(title) {
        case "調査対象商品一覧／登録":
            return <MenuBookIcon/>
        case "チェック条件設定":
            return <SettingsIcon/>
        case "チェック結果一覧":
            return <ListAltIcon/>
        case "ドメイン設定":
            return <AccountTreeIcon/>
        default:
            return <></>
    }
}

export default generateIcon