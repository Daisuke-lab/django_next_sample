import {FormColumnType} from '../components/FormModal'


export const productColumns:FormColumnType[] = [
    {
        name: "name",
        label: "商品名",
        type: "text"
    },
    {
        name: "condition",
        label: "チェック条件",
        type: "select"
    },
    {
        name: "keyword",
        label: "商標KW",
        type: "text"
    },
    {
        name: "genre",
        label: "商品ジャンル",
        type: "select"
    },
    {
        name: "memo",
        label: "メモ",
        type: "textArea"
    },

]