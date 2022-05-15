let obj = {
    "tendererNotice": {
        "name": "投标人须知",
        "groups": [{
                "metaId": 123,
                "key": "key",
                "name": "项目信息",
                "items": [{
                        "label": "项目名称",
                        "key": "key",
                        "value": "曲靖亚龙广场城市综合体"
                    },
                    {
                        "label": "建筑结构",
                        "key": "key",
                        "value": "框架结构"
                    },
                    {
                        "label": "工程地点",
                        "key": "key",
                        "value": "曲靖市麒麟区安宁西路"
                    }
                ]
            },
            {
                "metaId": 123,
                "key": "key",
                "name": "三、招标范围、计划工期和质量标准",
                "items": [{
                        field: 'scope', //字段名
                        component: 'Input', //select/input/textarea/date/checkbox/radio/
                        label: '招标范围',
                        defaultValue: '1111', //默认值可能是true/false /string/[]/{}
                        colProps: {
                            span: 24, //占的比例1-24
                        },
                        componentProps: {
                            placeholder: '请输入招标范围',
                            maxlength: 15,
                            disabled: true, //是否禁用......很熟熟悉都可以在这里面加上需要的属性
                            options: [{ //selet时候用
                                label: '123',
                                value: '123'
                            }, {
                                label: '1456',
                                value: '1456'
                            }],
                        },
                        rules: [{
                            required: true,
                            trigger: 'blur',
                            message: '请选择单位'
                        }] // 'scope'  string||Array /复杂正则返回字符串对应正则表里的名称,
                    },
                    {
                        field: 'areaNum',
                        component: 'Select',
                        label: '单位',
                        defaultValue: '1111',
                        colProps: {
                            span: 18,
                        },
                        componentProps: {
                            placeholder: '请选择单位',
                            options: [{
                                label: '123',
                                value: '123'
                            }, {
                                label: '1456',
                                value: '1456'
                            }],
                        },
                        rules: 'areaNum',
                    },
                ]
            }
        ]
    },
};
console.log(obj)