export default {
    props: {
        value: {
            type: String | Number | Object, default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            form: this.value
        }
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$emit('submit', e);
                } else {
                    this.$message.warning('无法提交，请填写完整');
                }
            });
        }
    },
    watch: {
        value(newVal) {
            this.form = newVal
        },
        form(val) {
            this.$emit('input', val);
        }
    }
}
