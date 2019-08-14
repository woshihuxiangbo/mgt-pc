export default {
    data () {
        return {
            show: this.mdActive
        };
    },
    props: {
        mdActive: {type: Boolean, default: false}
    },
    watch: {
        mdActive (n) {
            this.show = n;
        },
        show (n) {
            this.$emit('update:mdActive', n);
        }
    }
};
