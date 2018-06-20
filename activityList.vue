<template>
    <div class="page-wrap">
        <filtrate :addNewActivity="false"
                  :data="sourceData"></filtrate>
        <div class="page-content common-shadow">
            <div class="total-num">共有
                <span class="num">{{sourceData.pageData.totalNum}}</span>条活动记录</div>
            <div class="activity-list">
                <el-table :data="sourceData.pageData['items']"
                          border
                          v-loading="loading"
                          style="width: 100%"
                          cell-class-name="activity-list-style"
                          header-cell-class-name="list-header">
                    <el-table-column prop="id"
                                     label="ID"
                                     align="center"
                                     show-overflow-tooltip
                                     min-width="96">
                    </el-table-column>
                    <el-table-column prop="activityName"
                                     label="活动名称"
                                     show-overflow-tooltip
                                     min-width="180">
                    </el-table-column>
                    <el-table-column prop="activityTimeStr"
                                     label="活动时间"
                                     show-overflow-tooltip
                                     min-width="159">
                    </el-table-column>
                    <el-table-column prop="activityScoolName"
                                     label="校区"
                                     show-overflow-tooltip
                                     min-width="150">
                    </el-table-column>
                    <el-table-column prop="organizer"
                                     label="负责人"
                                     show-overflow-tooltip
                                     min-width="150">
                    </el-table-column>
                    <el-table-column prop="resourceCount"
                                     label="获取资源量"
                                     show-overflow-tooltip
                                     min-width="100">
                    </el-table-column>
                    <el-table-column prop="activityStatusName"
                                     label="状态"
                                     align="center"
                                     show-overflow-tooltip
                                     min-width="180">
                    </el-table-column>
                    <el-table-column label="操作"
                                     align="center"
                                     min-width="140">
                        <template slot-scope="scope">
                            <div class="handle-wrap">
                                <el-tag class="handle-item point"
                                        type="danger"
                                        @click.native="checkDetails(scope.row.id)">详细</el-tag>
                                <router-link :to="`/activity/backups/${scope.row.id}`">
                                    <el-tag>备份</el-tag>
                                </router-link>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
        <div class="pagination-wrap"
             v-if="sourceData.pageData.totalNum>10">
            <el-pagination background
                           @current-change="changePage"
                           :current-page="sourceData.pageData.currentPage"
                           layout="prev, pager, next"
                           :total="sourceData.pageData.totalNum">
            </el-pagination>
        </div>
        <!-- 查看详情 -->
        <el-dialog title="活动详情"
                   custom-class="common-dialog"
                   :visible.sync="showActivityDetail">
            <activity-details v-if="showActivityDetail"
                              :flag.sync="showActivityDetail"
                              :id="chekcDetailsId"></activity-details>
        </el-dialog>
        <!-- 新增 -->

    </div>
</template>
<script>
import activityDetails from "./components/activityDetail";
import filtrate from "./components/filtrate";
import pagination from "@/mixin/pagination.js";
export default {
    data() {
        return {
            activityList: [],
            showActivityDetail: false,
            loading: false,
            addNewActivity: false,
            chekcDetailsId: "",
            sourceData: {
                pageData: {
                    items: []
                }
            }
        };
    },
    mixins: [pagination],
    components: {
        activityDetails,
        filtrate
    },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.loading = true;
            let query = this.$route.query;
            this.$Http
                .get("/activity/list", {
                    params: query
                })
                .then(res => {
                    this.loading = false;
                    if (res.resultCode == 200) {
                        this.sourceData = res.content;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        checkDetails(id) {
            this.chekcDetailsId = id;
            this.showActivityDetail = true;
        }
    }
};
</script>
<style lang="scss">
.activity-list-style .cell {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    max-height: 66px;
}
.el-table th.list-header {
    background: #f5f6f7;
    background-color: #f5f6f7;
}
</style>

<style lang="scss" scoped>
@import "src/styles/variables.scss";
.page-content {
    position: relative;
    .activity-list {
        background: #fff;
        .list-index {
            background: red;
        }
    }
    .handle-wrap {
        text-align: center;
        .handle-item {
            margin: 0 5px;
        }
    }
}
.detail-dialog {
    width: 80%;
    max-width: 1160px;
}
</style>

