export class EditorFullScreen {
    constructor(quill, config = {}) {
        this.quill = quill;
        this.config = config;
        this.isFullscree = false;
        this.container = null;
        this.contailerClasses = '';
        this.insetFullScreenButton();
    }

    insetFullScreenButton() {
        let span = document.createElement('span');
        span.className = 'ql-formats';
        let button = document.createElement('button');
        if (this.config.icon !== undefined) {
            button.className = this.config.icon;
        } else {
            button.outerHTML = '全屏';
        }
        button.addEventListener('click', this.buttonClick.bind(this), false);
        span.appendChild(button);
        /**
         *
         * @type {Node & ParentNode}
         */
        this.container = this.quill.root.parentNode.parentNode;
        this.contailerClasses = this.container.className;
        let toolbar = this.container.querySelector('.ql-toolbar');
        toolbar.appendChild(span);
    }

    buttonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        console.info(this.container);
        if (this.isFullscree) {
            this.container.className = this.contailerClasses;
        } else {
            this.container.className = this.contailerClasses + ' ql-fullscree ' + this.config.className;
        }
        if (this.config.onChange) {
            this.config.onChange(this);
        }
        this.isFullscree = !this.isFullscree;
    }
}