<template>
    <div class="page-wrap create-activity">
        <filtrate :addNewActivity="true"
                  :data="{}"></filtrate>
        <div class="page-content common-shadow">
            <el-form :model="form"
                     :rules="rules"
                     ref="formActivity"
                     class="inner">
                <el-form-item label="活动名称"
                              class="required-word"
                              :label-width="formLabelWidth"
                              prop="activityName">
                    <el-input v-model="form.activityName"
                              placeholder="必填，限50个字以内"></el-input>
                </el-form-item>
                <el-form-item label="活动时间"
                              class="required-word"
                              :label-width="formLabelWidth"
                              prop="activityTime">
                    <div class="block">
                        <el-date-picker v-model="form.activityTime"
                                        type="datetime"
                                        :picker-options="dataLimitOption"
                                        placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="举办校区"
                              :label-width="formLabelWidth">
                    <div>{{userInfo.school}}</div>
                </el-form-item>
                <el-form-item label="负责人"
                              :label-width="formLabelWidth">
                    <div>{{ userInfo.name }}</div>
                </el-form-item>
                <el-form-item label="活动预算"
                              class="required-word"
                              prop="budget"
                              :label-width="formLabelWidth">
                    <el-input v-model="form.budget"
                              @change="(value) => numberChange(value, 'budget')"
                              type="number"
                              placeholder="必填"></el-input>
                </el-form-item>
                <el-form-item label="活动目标"
                              prop="activityTarget"
                              class="required-word"
                              :label-width="formLabelWidth">
                    <el-input v-model="form.activityTarget"></el-input>
                </el-form-item>

                <el-form-item label="兼职"
                              :label-width="formLabelWidth">
                    <el-form :inline="true"
                             :model="form"
                             :rules="rules"
                             id="line-form"
                             ref="formActivityInline"
                             label-position="left"
                             class="demo-form-inline">
                        <el-form-item label="人数"
                                      prop="count"
                                      class="mb15"
                                     >
                            <el-input v-model.number="form.count"
                                      @change="(value) => numberChange(value, 'count')"></el-input>
                        </el-form-item>
                        <el-form-item label="价格元/人/次"
                                      prop="price"
                                      class="mb15"
                                      >
                            <el-input v-model.number="form.price"
                                      @change="(value) => numberChange(value, 'price')"></el-input>
                        </el-form-item>
                        <el-form-item label="人次"
                                      prop="times"
                                      class="mb15"
                                      >
                            <el-input v-model.number="form.times"
                                      @change="(value) => numberChange(value, 'times')"></el-input>
                        </el-form-item>
                    </el-form>
                </el-form-item>

                <el-form-item label="资源支持"
                              class="required-word"
                              :label-width="formLabelWidth">
                    <div class="other-support-wrap">
                        <el-row v-if="checkedStr">
                            <el-col :span="24">
                                <div class="total-support">
                                    {{checkedStr}}
                                    <!-- 宣传单：500份 易拉宝：2个 海报：20 张教师：2名 国学1名 国画1名 教室：1间 100人 -->
                                </div>
                            </el-col>
                        </el-row>
                        <el-row class="clearfix">
                            <div class="fl other-support">
                                其他
                            </div>
                            <div class="fl other-support-input">
                                <el-input type="textarea"
                                          v-model="form.resourceInfo"></el-input>
                            </div>
                        </el-row>

                    </div>
                    <el-row class="clearfix editor-support">
                        <div class="deep-blue-btn"
                             @click="showResourceTable = true">修改</div>
                    </el-row>
                    <div class="resource-wrap"
                         v-show="showResourceTable"
                         style="display:none;">
                        <el-table :data="resourceList.items"
                                  border
                                  class="support-check-inner"
                                  style="width: 100%">
                            <el-table-column prop="name"
                                             label="物料"
                                             show-overflow-tooltip
                                             min-width="100">
                            </el-table-column>
                            <el-table-column label="需求量"
                                             show-overflow-tooltip
                                             min-width="150">
                                <template slot-scope="scope">
                                    <el-input-number v-model="scope.row.useNum"
                                                     controls-position="right"
                                                     :min="0"
                                                     :max="scope.row['isNewProduction'] == 0 ? (scope.row.stockQuantity || 0) : 5000"></el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column prop="unit"
                                             show-overflow-tooltip
                                             min-width="80"
                                             label="单位">
                            </el-table-column>
                            <el-table-column prop="address"
                                             show-overflow-tooltip
                                             min-width="120"
                                             label="库存">
                                <template slot-scope="scope">
                                    <div class="deep-blue-btn-text"
                                         v-if="scope.row.stockQuantity >=0">
                                        <el-select v-model="scope.row['isNewProduction']"
                                                   placeholder="">
                                            <el-option :label="`库存 ${scope.row.stockQuantity}`"
                                                       :value="0">
                                            </el-option>
                                            <el-option label="新制作"
                                                       :value="1">
                                            </el-option>
                                        </el-select>

                                    </div>
                                    <div class="deep-blue-btn-text"
                                         v-else
                                         @click="showClassroomDialog = true">查询可用</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address"
                                             show-overflow-tooltip
                                             width="80"
                                             align="center"
                                             label="选择">
                                <template slot-scope="scope">
                                    <div class="">
                                        <el-checkbox v-model="checkUseList"
                                                     :label="scope.row.id"
                                                     @change="(val) => changeCheck(val, scope.row)"
                                                     name="type">&nbsp;</el-checkbox>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                        <div class="pagination-wrap">
                            <el-pagination background
                                           @current-change="changeResourcePage"
                                           :current-page="resourceList.currentPage"
                                           layout="prev, pager, next"
                                           :total="resourceList.totalNum">
                            </el-pagination>
                        </div>
                        <el-row class="clearfix editor-support">
                            <div class="deep-blue-btn"
                                 @click="saveCheckedResource">确定</div>
                        </el-row>
                    </div>
                </el-form-item>
                <el-form-item label="活动说明"
                              class="required-word"
                              prop="activityDescription"
                              :label-width="formLabelWidth">
                    <el-input type="textarea"
                              placeholder="必填，限50个字以内"
                              v-model="form.activityDescription"></el-input>
                </el-form-item>
            </el-form>
            <div class="save-activity tc">
                <el-button type="primary"
                           class="deep-blue-btn save-btn"
                           :loading="isLoading"
                           @click.native.prevent="saveActivity">提交审批</el-button>
            </div>
        </div>
        <!-- 弹窗 -->
        <!-- 查询教师 -->
        <el-dialog custom-class="query-dialog"
                   :visible.sync="showTeacherDialog"
                   :show-close="false">
            <el-table :data="teacherList">
                <el-table-column property="class"
                                 label="学科"></el-table-column>
                <el-table-column property="num"
                                 label="教师可用"></el-table-column>
                <el-table-column property="address"
                                 label="选择">
                    <template slot-scope="scope">
                        <el-input-number v-model="teacherList[scope.$index].useTeacher"
                                         controls-position="right"
                                         :min="0"
                                         :max="scope.row.num"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
            <div class="deep-blue-btn dialog-btn"
                 @click="showTeacherDialog = false">确定</div>
        </el-dialog>
        <!-- 查询教室可用 -->
        <el-dialog custom-class="query-dialog"
                   :visible.sync="showClassroomDialog"
                   :show-close="false">
            <el-table :data="classRoomList">
                <el-table-column property="name"
                                 label="教室"></el-table-column>
                <el-table-column property="canUseNum"
                                 label="教室可用数"></el-table-column>
                <el-table-column property="accommodate"
                                 label="可容纳人数"></el-table-column>
                <el-table-column label="选择">
                    <template slot-scope="scope">
                        <el-input-number v-model="classRoomList[scope.$index].useClass"
                                         controls-position="right"
                                         :min="0"
                                         :max="scope.row.canUseNum"></el-input-number>
                    </template>
                </el-table-column>
            </el-table>
            <div class="deep-blue-btn dialog-btn"
                 @click="showClassroomDialog = false">确定</div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import filtrate from "./components/filtrate";
export default {
    data() {
        let createDateLimit = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请选择活动时间"));
            } else if (new Date(value).getTime() < new Date().getTime()) {
                callback(new Error("活动时间应小于当前日期!"));
            } else {
                callback();
            }
        };
        let limitInt = (rule, value, callback, type) => {
            if (!value) {
                callback(new Error("请输入正确内容"));
            } else if (value && value <= 0) {
                callback(new Error("请输入大于0的正整数"));
                return false;
            } else {
                if(type && type == 'budget' && value>100000) {
                    callback(new Error("活动预算范围为1~100000"));
                    return;
                }else if(type && type == 'count' && value>99) {
                    callback(new Error("活动预算范围为1~99"));
                    return;
                }else if(type && type == 'price' && value>999) {
                    callback(new Error("价格范围为1~999"));
                    return;
                }else if(type && type == 'times' && value>999) {
                    callback(new Error("人次范围为1~999"));
                    return;
                }
                callback();
            }
        };
        return {
            showActivityDetail: false,
            addNewActivity: false,
            isLoading: false,
            dataLimitOption: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
            form: {
                activityName: "",
                activityTime: "",
                budget: "",
                activityTarget: "",
                count: "0",
                price: "0",
                times: "0",
                resourceInfo: ""
            },
            formLabelWidth: "120px",
            teacherList: [],
            classRoomList: [],
            showResourceTable: true,
            showTeacherDialog: false,
            showClassroomDialog: false,
            resourceList: {},
            checkUseList: [],
            checkedObj: {},
            checkedStr: "",
            rules: {
                activityName: [
                    {
                        required: true,
                        message: "请输入活动名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 50,
                        message: "长度在 1 到 50 个字符",
                        trigger: "blur"
                    }
                ],
                activityTime: [
                    {
                        required: true,
                        message: "请选择活动时间",
                        trigger: "blur"
                    },
                    { validator: createDateLimit, trigger: "blur" }
                ],
                budget: [
                        {
                        validator: (rule, value, callback) =>limitInt(rule, value, callback, 'budget'),
                        trigger: "blur"
                    }
                ],
                count: [
                    {
                        validator: (rule, value, callback) =>limitInt(rule, value, callback, 'count'),
                        trigger: "blur"
                    }
                ],
                price: [
                    {
                        validator: (rule, value, callback) =>limitInt(rule, value, callback, 'price'),
                        trigger: "blur"
                    }
                ],
                times: [
                    {
                        validator: (rule, value, callback) =>limitInt(rule, value, callback, 'times'),
                        trigger: "blur"
                    }
                ],
                activityTarget: [
                    {
                        required: true,
                        message: "请输入活动目标",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 50,
                        message: "长度在 1 到 50 个字符",
                        trigger: "blur"
                    }
                ],
                activityDescription: [
                    {
                        required: true,
                        message: "请输入活动说明",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 500,
                        message: "长度在 1 到 500 个字符",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    components: {
        filtrate
    },
    computed: {
        ...mapGetters(["userInfo"])
    },
    created() {
        this.getResource();
    },
    methods: {
        getResource(page) {
            this.$Http
                .get(`/activity/resource-support-info-const?page=${page || 1}`)
                .then(res => {
                    if (res.resultCode == 200) {
                        for (let i = 0; i < res.content.items.length; i++) {
                            res.content.items[i]["useNum"] = 0;
                            res.content.items[i]["isNewProduction"] = 0;
                        }
                        this.resourceList = res.content;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        changeResourcePage(val) {
            this.getResource(val);
        },
        changeCheck(val, row) {
            if (val) {
                this.checkedObj[row.id] = row;
            } else {
                //取消
                delete this.checkedObj[row.id];
            }
        },
        saveCheckedResource() {
            let s = "";
            for (const key in this.checkedObj) {
                let k = this.checkedObj[key];
                s += `${k.name}: ${k.useNum} ${k.unit}  `;
            }
            this.checkedStr = s;
            this.showResourceTable = false;
        },
        numberChange(val, type) {
            this.$nextTick(() => {
                let t;
                t =
                    parseInt(val, 10).toString() === "NaN"
                        ? "0"
                        : parseInt(val, 10) + "";
                switch (type) {
                    case "budget":
                        this.form.budget = t;
                        break;
                    case "count":
                        this.form.count = t;
                        break;
                    case "price":
                        this.form.price = t;
                        break;
                    case "times":
                        this.form.times = t;
                        break;
                    default:
                        break;
                }
                this.$forceUpdate();
            });
        },
        saveActivity() {
            let self = this;
            if (self.isLoading) {
                return;
            }
            self.$refs["formActivity"].validate(valid => {
                if (valid) {
                    self.$refs["formActivityInline"].validate(validline => {
                        if (validline) {
                            if(this.showResourceTable && this.checkedObj.toString !=='{}') {
                                self.$message.error('您还没有确认相关的物料支持信息！')
                                return;
                            }
                            self.isLoading = true;
                            self.form[
                                "activityTimeStr"
                            ] = self.$utils.timeFormDate(
                                self.form["activityTime"]
                            );
                            /**
                             * 物料支持格式
                             */
                            let resourceArr = [];
                            for (const key in this.checkedObj) {
                                let k = this.checkedObj[key];
                                resourceArr.push({
                                    name: k["name"],
                                    category: 10,
                                    materialId: k["id"],
                                    demandCount: k["useNum"],
                                    isNewProduction: k["isNewProduction"]
                                });
                            }
                            self.form["resourceSupports"] = resourceArr;
                            self.form["transformRequest"] = true;
                            self.$Http
                                .post("/activity/activity", self.form, {
                                    headers: {
                                        "Content-Type":
                                            "application/json;charset=utf-8"
                                    }
                                })
                                .then(res => {
                                    if (res.resultCode == 200) {
                                        self.$message({
                                            message:
                                                "发布活动成功，即将跳转到活动列表~~",
                                            type: "success",
                                            duration: 1300,
                                            onClose() {
                                                self.isLoading = false;
                                                self.$router.push("/activity");
                                            }
                                        });
                                    } else {
                                        self.$message.error(res.msg);
                                        self.isLoading = false;
                                    }
                                })
                                .catch(e => {
                                    self.isLoading = false;
                                });
                        } else {
                            self.$message.error("请完善信息后重试！");
                            return false;
                        }
                    });
                } else {
                    self.$message.error("请完善信息后重试！");
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss">
.create-activity {
    .el-form-item--medium .el-form-item__content {
        margin-left: 300px !important;
        position: relative;
    }
    .el-form-item__label {
        font-size: 14px;
        color: rgba(58, 58, 58, 1);
        position: relative;
    }
    .el-input-number--medium {
        width: 60%;
    }
    .support-check-inner {
        .cell {
            text-align: center;
        }
        .has-gutter > tr > th:nth-of-type(5) .cell {
            text-align: right;
        }
    }
    .query-dialog {
        .el-dialog__body {
            padding: 0;
        }
        .cell {
            text-align: center;
        }
        .el-dialog__header {
            display: none;
        }
    }
}
@media screen and (max-width: 1000px) {
    .create-activity {
        .el-form-item--medium .el-form-item__content {
            margin-left: 178px !important;
        }
        .el-input-number--medium {
            width: 100%;
        }
    }
}
@media screen and (max-width: 600px) {
    .create-activity {
        .el-form-item--medium .el-form-item__content {
            margin-left: 80px !important;
        }
        .el-form-item__label {
            width: 80px !important;
        }
    }
}
#line-form .el-form-item--medium .el-form-item__content {
    margin-left: 0 !important;
}
</style>

<style lang="scss" scoped>
@import "src/styles/variables.scss";
.page-content {
    position: relative;
    background: #fff;
    margin-top: 10px;
    padding: 30px 20px;
}
@media screen and (max-width: 600px) {
    .page-content {
        padding: 20px 10px;
    }
}
.margin-bottom {
    margin-bottom: 5px;
}
.mb15 {
    margin-bottom: 15px;
}
.other-support-wrap {
    padding: 10px 20px 20px;
    background: #edf1f7;
    .other-support {
        max-width: 80px;
    }
    .total-support {
        font-size: 14px;
        color: rgba(106, 106, 106, 1);
        padding: 5px 0;
    }
    .other-support-input {
        width: calc(100% - 130px);
        margin-left: 10px;
    }
}
.editor-support {
    margin: 10px auto 20px;
}
.save-btn {
    width: 200px;
    margin-top: 96px;
}
.query-dialog {
    width: 80%;
    max-width: 500px;
}
.dialog-btn {
    margin: 50px auto 30px;
}
</style>

