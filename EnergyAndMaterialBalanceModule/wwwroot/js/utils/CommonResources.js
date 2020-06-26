var CommonResources = {
    afterBGroupCreationState: false,
    directions: [
        {
            value: '+',
            name: '+',
        },
        {
            value: '-',
            name: '-',
        },
        {
            value: '~',
            name: '~',
        }
    ],
    tables: {
        points: function (data, i) {
            return {
                colData: [
                    {
                        col: 'col-1',
                        data: i + 1
                    },

                    {
                        col: 'col-2',
                        data: data.pointName
                    },

                    {
                        col: 'col-1',
                        data: data.direction
                    },

                    {
                        col: 'col-3',
                        data: data.tagname
                    },

                    {
                        col: 'col-2',
                        data: data.period.periodName
                    },

                    {
                        col: 'col-1',
                        data: data.validMistake
                    },

                    {
                        col: 'col-2',
                        data: data.source.sourceName
                    }
                ],
                attrData: {
                    attr: 'data-rowid',
                    data: data.pointId
                }
            }
        },
        tags: {
            head: {
                iteh: 
                    [
                        {
                            col: 'col-1',
                            data: '#'
                        },

                        {
                            col: 'col-2',
                            data: 'LSName'
                        },

                        {
                            col: 'col-3',
                            data: 'Имя базы данных'
                        },

                        {
                            col: 'col-3',
                            data: 'Имя таблицы'
                        },

                        {
                            col: 'col-3',
                            data: 'Имя тега'
                        }
                    ]
                ,
                historian_manual: 
                    [
                        {
                            col: 'col-1',
                            data: '#'
                        },

                        {
                            col: 'col-4',
                            data: 'Имя тега'
                        },

                        {
                            col: 'col-7',
                            data: 'Описание'
                        },
                    ]
                ,
            },
            body: {
                iteh: function (data, i) {
                    return {
                        colData: [
                            {
                                col: 'col-1',
                                data: i + 1
                            },

                            {
                                col: 'col-2',
                                data: data.lsname
                            },

                            {
                                col: 'col-3',
                                data: data.dbname
                            },

                            {
                                col: 'col-3',
                                data: data.tableName
                            },

                            {
                                col: 'col-3',
                                data: data.tagName
                            },
                        ],
                        attrData:
                        {
                            attr: 'data-rowid',
                            data: data.tagName
                        }

                    }
                },
                historian_manual: function (data, i) {
                    return {
                        colData: [
                            {
                                col: 'col-1',
                                data: i + 1,
                            },

                            {
                                col: 'col-4',
                                data: data.tagName,
                            },

                            {
                                col: 'col-7',
                                data: data.description,
                            },
                        ],
                        attrData: {
                            attr: 'data-rowid',
                            data: data.tagName
                        }
                    }
                },
            },
        },
    },
}
