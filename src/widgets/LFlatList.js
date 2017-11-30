'use strict'

var React = require('react');

var {
    FlatList,
    Platform,
    TouchableHighlight,
    View,
    Text,
    Image,
    RefreshControl,
} = require('react-native');

import {loadingImage} from "../constraint/Image"

const STATE_NO_MORE = 'noMore';
const STATE_LOADING = 'loading';
const STATE_ERROR = 'requestError';
const STATE_READY = 'ready';

// small helper function which merged two objects into one
function MergeRecursive(obj1, obj2) {
    for (var p in obj2) {
        try {
            if (obj2[p].constructor == Object) {
                obj1[p] = MergeRecursive(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch (e) {
            obj1[p] = obj2[p];
        }
    }
    return obj1;
}

var GiftedListView = React.createClass({

    getDefaultProps() {
        return {
            customStyles: {},
            initialListSize: 10,
            isShowFirstLoadView: false,
            refreshable: true,
            loadMoreable: false,
            refreshableColors: undefined,
            refreshableProgressBackgroundColor: undefined,
            refreshableSize: undefined,
            refreshableTitle: undefined,
            refreshableTintColor: undefined,
            renderRefreshControl: null,
            headerView: null,
            sectionHeaderView: null,
            scrollEnabled: true,
            onLoadMore(page, callback, options) {
                callback([]);
            },
            onRefreshing(callback, options) {
                callback([]);
            },

            loadingFooterView: null,
            loadingErrorFooterView: null,
            noMoreFooterView: null,
            emptyView: null,
            renderSeparator: null,
            showFirstLoadView: null,
        };
    },

    propTypes: {
        customStyles: React.PropTypes.object,
        initialListSize: React.PropTypes.number,
        isShowFirstLoadView: React.PropTypes.bool,
        refreshable: React.PropTypes.bool,
        loadMoreable: React.PropTypes.bool,
        refreshableColors: React.PropTypes.array,
        refreshableProgressBackgroundColor: React.PropTypes.string,
        refreshableSize: React.PropTypes.string,
        refreshableTitle: React.PropTypes.string,
        refreshableTintColor: React.PropTypes.string,
        renderRefreshControl: React.PropTypes.func,
        headerView: React.PropTypes.func,
        sectionHeaderView: React.PropTypes.func,
        scrollEnabled: React.PropTypes.bool,
        onLoadMore: React.PropTypes.func,
        onRefreshing: React.PropTypes.func,

        loadingFooterView: React.PropTypes.func,
        loadingErrorFooterView: React.PropTypes.func,
        noMoreFooterView: React.PropTypes.func,
        emptyView: React.PropTypes.func,
        renderSeparator: React.PropTypes.func,
        showFirstLoadView: React.PropTypes.func,
    },

    _setPage(page) {
        this._page = page;
    },
    _getPage() {
        return this._page;
    },
    _setRows(rows) {
        this._rows = rows;
    },
    _getRows() {
        return this._rows;
    },
    _isLoading() {
        return this._loadingState;
    },
    _setLoading(state) {
        this._loadingState = state;
    },

    // componentDidMount(){
    //     this._showFirstLoadView()
    // },

    /**
     * 加载更多数据中
     * @returns {XML}
     */
    _loadingFooterView() {
        if (this.props.loadingFooterView) {
            return this.props.loadingFooterView();
        }

        return (
            <View style={[this.defaultStyles.paginationView, this.props.customStyles.paginationView]}>
                <Text style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
                    加载数据中...
                </Text>
            </View>
        );
    },

    /**
     * 请求失败
     * @returns {XML}
     */
    _loadingErrorFooterView() {
        if (this.props.loadingErrorFooterView) {
            return this.props.loadingErrorFooterView();
        }
        return (
            <View
                style={[this.defaultStyles.paginationView, this.props.customStyles.paginationView, {flexDirection: 'row'}]}>
                <Text style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
                    请求出现异常
                </Text>
                <Text
                    onPress={() => {
                        this.setState({
                            loadingStatus: STATE_LOADING

                        });
                        this._loadMore();
                    }}
                    style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel, {
                        color: '#dab26a',
                        marginLeft: 10
                    }]}>
                    点击重试
                </Text>
            </View>
        );
    },

    /**
     * 所有数据已经加载完毕
     * @returns {XML}
     */
    _noMoreFooterView() {
        if (this.props.noMoreFooterView) {
            return this.props.noMoreFooterView();
        }

        return (
            <View style={[this.defaultStyles.paginationView, this.props.customStyles.paginationView]}>
                <Text style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
                    已经没有更多数据
                </Text>
            </View>
        );
    },

    headerView() {
        if (!this.props.headerView) {
            return null;
        }
        return this.props.headerView();
    },
    _emptyView(refreshCallback) {
        if (this.props.emptyView) {
            return this.props.emptyView(refreshCallback);
        }

        return (
            <View style={[this.defaultStyles.defaultView, this.props.customStyles.defaultView]}>
                <Text style={[this.defaultStyles.defaultViewTitle, this.props.customStyles.defaultViewTitle]}>
                    对不起，当前没有可以显示的数据
                </Text>

                <TouchableHighlight
                    underlayColor='#c8c7cc'
                    onPress={refreshCallback}>
                    <Text>
                        点击刷新
                    </Text>
                </TouchableHighlight>
            </View>
        );
    },
    renderSeparator() {
        if (this.props.renderSeparator) {
            return this.props.renderSeparator();
        }

        return (
            <View style={[this.defaultStyles.separator, this.props.customStyles.separator]}/>
        );
    },

    getInitialState() {
        this._setPage(0);
        this._setRows([]);

        return {
            dataSource: [],
            loadMoreable: this.props.loadMoreable,
            isRefreshing: false,
            isLoading: false,
            loadingStatus: this.props.loadMoreable? STATE_LOADING: STATE_NO_MORE,
            isShowFirstLoadView: this.props.isShowFirstLoadView,
        };
    },

    /**
     * 显示第一次加载页面
     * @returns {XML}
     */
    _showFirstLoadView() {
        if (this.props.isShowFirstLoadView) {
            this.props.onRefreshing(this._refreshCallback);
        }
    },

    _onRefresh(options = {}) {
        this.setState({
            isRefreshing: true,
        });
        this._setPage(0);
        this.props.onRefreshing(this._refreshCallback);
    },

    /**
     * 刷新时候的回调
     * @param rows
     * @param options
     */
    _refreshCallback(rows = [], options = {}) {
        if(options.pageNumber !== undefined && !isNaN(options.pageNumber)){
            this._setPage(options.pageNumber)
        }
        this._updateListUI(rows, options);
    },

    setNativeProps(props) {
        this.refs.listview.setNativeProps(props);
    },


    _loadMore() {
        if (this.state.loadingStatus !== STATE_NO_MORE) {
            this.props.onLoadMore(this._getPage(), this._loadMoreCallback, {});
        }
    },

    _loadMoreCallback(rows = [], options = {}) {

        this._setPage(this._getPage() + 1);
        let mergedRows = this._getRows().concat(rows);
        this._updateListUI(mergedRows, options);
    },

    _updateListUI(rows = [], options = {}) {
        if (rows !== null) {
            this._setRows(rows);
            if (options.requestError === true) {
                this._setPage(this._getPage() - 1);
                this.setState({
                    dataSource: this._getRows(),
                    isRefreshing: false,
                    loadingStatus: STATE_ERROR,
                    loadMoreable: options.loadMoreable === undefined ? true : options.loadMoreable,
                    isShowFirstLoadView: options.isShowFirstLoadView,
                });
            } else {
                this.setState({
                    dataSource: this._getRows(),
                    isRefreshing: false,
                    loadingStatus: (options.haveNext === true ? STATE_LOADING : STATE_NO_MORE),
                    loadMoreable: options.loadMoreable === undefined ? true : options.loadMoreable,
                    isShowFirstLoadView: options.isShowFirstLoadView,
                });
            }
        }

        setTimeout(() => {
            this._setLoading(false);
        }, 200);

    },
    _renderFooterView() {
        let loadingStatus = this.state.loadingStatus;
        let loadMoreable = this.state.loadMoreable;
        if (loadingStatus === STATE_LOADING && loadMoreable) {
            return this._loadingFooterView();
        } else if (loadingStatus === STATE_ERROR && loadMoreable) {
            return this._loadingErrorFooterView();
        } else if (loadingStatus === STATE_NO_MORE && loadMoreable) {
            return this._noMoreFooterView();
        } else if (this._getRows().length === 0) {
            return this._emptyView(this._onRefresh);
        } else {
            return null;
        }
    },

    _toEnd() {
        let loadingStatus = this.state.loadingStatus;
        if (loadingStatus === STATE_LOADING && !this._isLoading()) {
            this._setLoading(true);
            this._loadMore(this._getPage(), this._loadMoreCallback, {});
        }
    },

    _keyExtractor(item, index) {
        return index;
    },
    _scrollToIndex(viewPosition, index) {
        this.refs.flatList.scrollToIndex({viewPosition: viewPosition, index: index});
    },
    render() {
        return (
            <View style={{flex: 1}}>
                {
                    this.state.isShowFirstLoadView ? (
                        <View
                            style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
                            <Image onLoad={this._showFirstLoadView}
                                   source={{uri: loadingImage}}
                                   style={{width: 50, height: 50,}}/>
                        </View>
                    ) : (
                        <FlatList
                            ref="flatList"
                            data={this.state.dataSource}
                            footerViewStatus={this.state.loadingStatus}//没有其他意义，单纯更新footerView
                            renderSectionHeader={this.props.sectionHeaderView}
                            ListHeaderComponent={this.headerView}
                            ListFooterComponent={this._renderFooterView}
                            renderSeparator={this.state.loadMoreable ? this.renderSeparator:null}
                            removeClippedSubviews={false}
                            automaticallyAdjustContentInsets={false}
                            scrollEnabled={this.props.scrollEnabled}
                            canCancelContentTouches={true}
                            onRefresh={this.props.refreshable ? this._onRefresh : null}
                            refreshing={this.state.isRefreshing}
                            keyExtractor={this._keyExtractor}
                            enableEmptySections={true}

                            onEndReached={this._toEnd}
                            onEndReachedThreshold={0.2}

                            {...this.props}

                            style={this.props.style}
                        />
                    )
                }
            </View>

        );

    },

    defaultStyles: {
        separator: {
            height: 1,
        },
        actionsLabel: {
            fontSize: 12,
        },
        paginationView: {
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        defaultView: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        defaultViewTitle: {
            fontSize: 13,
            color: 'black',
            fontWeight: 'bold',
            marginBottom: 15,
        },
    },
});


module.exports = GiftedListView;
