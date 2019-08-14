export default {
    data() {
        return {
            table: {
                data: [],
                page: {
                    total: 0
                }
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            }
        };
    },
    methods: {
        changeDateRange(e) {
            try {
                this.query.startTime = parseInt(new Date(e[0]).getTime() / 1000);
                this.query.endTime = parseInt(new Date(e[1]).getTime() / 1000);
            } catch (e) {
            }
        },
        onSortChange({prop, order}) {
            if (order === null) {
                this.query.params.sortOrder = '';
                this.query.params.sortBy = '';
            } else {
                this.query.params.sortOrder = prop;
                this.query.params.sortBy = order.replace('ending', '');
            }
            this.getData();
        },
        //来源
        changeQueryStoreId(e) {
            switch (e) {
                case undefined: {
                    this.query.store_id = undefined;
                    break;
                }
                case 0: {
                    this.query.store_id = 0;
                    break;
                }
                case 1: {
                    this.query.store_id = 1;
                    break;
                }
            }
        },
        changeQueryStatus(e) {
            switch (e) {
                case undefined: {
                    this.query.deleted = 0;
                    this.query.disabled = 0;
                    break;
                }
                case 1: {
                    this.query.deleted = 1;
                    this.query.disabled = 2;
                    break;
                }
                case 2: {
                    this.query.deleted = 2;
                    this.query.disabled = 1;
                    break;
                }
                case 3: {
                    this.query.deleted = 2;
                    this.query.disabled = 2;
                    break;
                }
            }
        },
        onPageCurrentChange() {
            this.getData();
        },
        datetimeFormatter (row, column, cellValue,) {
            if (cellValue === undefined || cellValue === 0) return '-';
            let unix = parseInt(cellValue * 1000);
            return new Date(unix).format('yyyy-MM-dd HH:mm:ss');
        }
    },
    filters: {
        statusFilter(val) {
            if (val.disabled) {
                return '已禁用';
            } else if (val.deleteTime) {
                return '已删除';
            }
            return '正常';
        },
        dateFilter(val) {
            if (val === undefined || val === 0) return '-';
            let unix = parseInt(val * 1000);
            return new Date(unix).format('yyyy-MM-dd HH:mm:ss');
        }
    }
};
