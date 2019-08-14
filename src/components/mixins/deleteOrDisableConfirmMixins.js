export default {
    data () {
        return {
            typeName: ''
        }
    },
    methods: {
        onDeleted (item, api) {
            let action = item.deleteTime ? '恢复' : '删除';
            this.$util.actionConfirm(`是否${action}${this.typeName}?`).then(() => {
                this.loading = true;
                api.deleted({id: item.id}).then(res => {
                    this.$util.handelHttpResponseResult(res).then(() => {
                        this.getData();
                    })
                }).finally(() => this.loading = false);
            })
        },
        onDisabled (item, api) {
            let action = item.disabled ? '启用' : '禁用';
            this.$util.actionConfirm(`是否${action}${this.typeName}?`).then(() => {
                this.loading = true;
                api.disabled({id: item.id}).then(res => {
                    this.$util.handelHttpResponseResult(res).then(() => {
                        this.getData();
                    })
                }).finally(() => this.loading = false);
            })
        }
    }
}