// pointer多点触控可能不能都释放 极端操作，各种切换窗口
// dragend不能直接curEvent.mouseup，应该发一个event事件
// keydown统一升级 多键
// radio disable的时候依旧可以点击（bug）
// 手势移出webview，壳返回一个事件
// flex解决padding问题
// init时候ios下键盘弹起，top和bottom的值也需要记录
// mask尽量使用fixed。mask返回dom el
// 加载没有的路由，给一个提示，提示什么路由没有
// form回填可以回填array，测试该功能
// context存储上一个loaction hash名字，返回的时候用
// metadata更新数据，由后端控制数据，前端根据协议更新数据
// control $cache方法抽取代码到adapter

// 文档写createArray createobject， DENY_CACHE ALLOW_LEAVE 控件的CACHE，使用方法见ext.cache

ecui.ui.ShowMore = ecui.inherits(ecui.ui.Control, 'show-src', {
    onclick: function () {
        if (!this.tagOpen) {
            ecui.dom.previous(this.getMain()).style.display = 'block';
            this.alterStatus('+open');
            this.setContent('收起');
            this.tagOpen = true;
        } else {
            ecui.dom.previous(this.getMain()).style.display = 'none';
            this.tagOpen = false;
            this.alterStatus('-open');
            this.setContent('查看源码');
        }
    }
});

ecui.ui.Code = ecui.inherits(
    ecui.ui.Control,
    function (el, options) {
        ecui.ui.Control.call(this, el, options);
        this._isShow = options.isShow;
        var codeTag = ecui.dom.first(el);
        this.codeStr = codeTag.innerHTML;
        codeTag.innerHTML = '';
    },
    {
        $ready: function () {
            ecui.ui.Control.prototype.$ready.call(this);
            var codeTag = ecui.dom.first(this.getMain());
            codeTag.innerText = this.codeStr;
            hljs.highlightBlock(codeTag);
            !this._isShow && this.hide();
        }
    }
);
ecui.ui.CodeView = ecui.inherits(
    ecui.ui.Control,
    'code-view',
    function (el, options) {
        ecui.ui.Control.call(this, el, options);
        this._uCode = ecui.$fastCreate(ecui.ui.Code, ecui.dom.first(el), this, {
            isShow: options.isShow
        });
        this._uOptions = ecui.$fastCreate(this.Options, ecui.dom.last(el), this);
    },
    {
        Options: ecui.inherits(
            ecui.ui.Control,
            function (el, options) {
                ecui.ui.Control.call(this, el, options);
                this._uShowMore = ecui.$fastCreate(this.ShowMore, ecui.dom.first(el), this);
                this._uCopy = ecui.$fastCreate(this.Copy, ecui.dom.last(el), this);
            },
            {
                ShowMore: ecui.inherits(ecui.ui.Control, {
                    $click: function (event) {
                        ecui.ui.Control.prototype.$click(this, event);
                        var code = this.getParent().getParent()._uCode;
                        if (!this.tagOpen) {
                            code.show();
                            this.alterStatus('+open');
                            this.setContent('收起');
                            this.tagOpen = true;
                        } else {
                            code.hide();
                            this.tagOpen = false;
                            this.alterStatus('-open');
                            this.setContent('查看源码');
                        }
                    }
                }),
                Copy: ecui.inherits(ecui.ui.Control, {
                    $click: function (event) {
                        ecui.ui.Control.prototype.$click(this, event);
                        ecui.util.clipboard(this.getParent().getParent().codeStr);
                    }
                })
            }
        )
    }
);

ecui.ui.CommonTreeView = ecui.inherits(
    ecui.ui.TreeView,
    function (el, options) {
        ecui.ui.TreeView.call(this, el, options);
    },
    {
        setSelectItem: function (filterFunction) {
            var that = this;
            var queue = [this];
            var item;
            while (queue.length !== 0) {
                item = queue.shift();
                if (that !== item && filterFunction(item)) {
                    break;
                }
                if (item._aChildren) {
                    queue.push.apply(queue, item._aChildren);
                }
                item = null;
            }
            if (item === null) return;
            var pItem = item.getParent();
            if (pItem && pItem.isCollapsed && pItem.isCollapsed()) {
                ecui.dispatchEvent(pItem, 'arrowclick');
            }
            this.getRoot().setSelected(item);
        },
        $click: function (event) {
            ecui.ui.Control.prototype.$click.call(this, event);

            for (
                var control = event.getControl();
                control !== this;
                control = control.getParent()
            ) {
                if (control instanceof ecui.ui.TreeView) {
                    return;
                }
            }
            if (this.getMain().getAttribute('disabled') === 'true') return;

            ecui.dispatchEvent(this, 'nodeclick', event);
        },
        onarrowclick: function () {
            if (this._eContainer) {
                if (this.isCollapsed()) {
                    this.expand();
                    ecui.dispatchEvent(this, 'expand');
                } else {
                    this.collapse();
                    ecui.dispatchEvent(this, 'collapse');
                }
            }
        },
        ArrowBtn: ecui.inherits(
            ecui.ui.Control,
            function (el, options) {
                ecui.ui.Control.call(this, el, options);
            },
            {
                onclick: function (e) {
                    var parent = frd.util.findControl(this.getMain(), ecui.ui.CommonTreeView);
                    parent && ecui.dispatchEvent(parent, 'arrowclick', e);
                    e.stopPropagation();
                }
            }
        ),
        TipView: ecui.inherits(
            ecui.ui.Control,
            function (el, options) {
                options.ext = { dynamictip: 'right' };
                ecui.ui.Control.call(this, el, options);
            },
            {
                refeshStatus: function () {
                    var pEl = this.getMain();
                    var cEl = ecui.dom.first(this.getMain());
                    if (cEl.offsetHeight > pEl.offsetHeight) {
                        this.isCanShow = true;
                    } else {
                        this.isCanShow = false;
                    }
                },
                onready: function () {
                    this.refeshStatus();
                }
            }
        ),
        setSelected: function (item) {
            var oldItem = this['$SelectedData'].value;
            ecui.ui.TreeView.prototype.setSelected.call(this, item);

            if (oldItem && item !== oldItem) {
                oldItem = oldItem.getParent();
                while (oldItem && oldItem.getRoot && oldItem !== oldItem.getRoot()) {
                    oldItem.alterStatus('-' + 'pselected');
                    oldItem = oldItem.getParent();
                }
            }

            item = item && item.getParent();
            while (item && item.getRoot && item !== item.getRoot()) {
                item.alterStatus('+' + 'pselected');
                item = item.getParent();
            }
        }
    }
);
