<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.stuffname')" align="center">
        <template slot-scope="scope">
          <span>{{  scope.row.stuffname}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.borrowtitle')" align="center">
        <template slot-scope="scope">
          <span>{{  scope.row.borrow_money}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updatetime')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleCreate(scope.row)">{{ $t('table.borrow') }}</el-button>
          <el-button type="success"  size="mini" @click="handleUpdate(scope.row)">{{ $t('table.back') }}</el-button>
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">{{ $t('table.detail') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('table.borrow')" prop="money">
          <el-input type="number" v-model="temp.money"/>
        </el-form-item>
        <!-- <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item> -->
       <!--  <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>
        </el-form-item> -->
        <el-form-item :label="$t('table.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog title="详情" :visible.sync="dialogDetailVisible">
      <el-table :data="gridData">
        <el-table-column property="id" label="序号" width="200"></el-table-column>
        <el-table-column property="stuffname" label="姓名" width="200"></el-table-column>
        <el-table-column property="money" label="借还款"></el-table-column>
        <el-table-column property="create_time" label="日期" width="150"></el-table-column>
        <el-table-column property="remark" label="备注"></el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle,fetchDetailList,patchStuff,stuffBorrowSum} from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import axios from "axios";
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        // id: undefined,
        // importance: 1,
        // timestamp: new Date(),
        stuffname: '',
        stuff_id: 0,
        type: '',
        money: 0,
        remark: ''
      },
      copyTemp:{
        stuffname: '',
        stuff_id: 0,
        type: '',
        money: 0,
        remark: ''
      },
      dialogFormVisible: false,
      dialogDetailVisible:false,
      dialogStatus: '',
      textMap: {
        update: '还款',
        create: '借款'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        money: [{ required: true, message: 'money is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      gridData:[] // 员工借还详情
    }
  },
  created() {
    this.getList()
    // this.patchStuff()
    // $.ajax({
    //     type: "PATCH",
    //     url: '/v2/stuffs/1',
    //     method: 'patch',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     data:{'borrow_money':'20'},
    //     success: function(){
    //       console.log('success')
    //     },
    //     error: onError,
    //     xhrFields: {withCredentials: true},
    //     crossDomain: true
    // })

    // axios.patch(`http://localhost/father/api/web/v2/stuffs/1`,{borrow_money:11},{
    // });
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response.data.data)
        this.list = response.data.data
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        stuffname: '',
        stuff_id: 0,
        type: '',
        money: 0,
        remark: ''
      }
    },
    handleCreate(row) {
      this.resetTemp();
      this.copyTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.stuff_id = this.copyTemp.id // mock a id
          this.temp.stuffname = this.copyTemp.stuffname // mock a id
          this.temp.type = 'borrow'
          this.temp.remark = this.copyTemp.remark
          createArticle(this.temp).then(() => {
            // 当前员工求和
            stuffBorrowSum(this.temp.stuff_id).then((res)=>{
                console.log(res.data.data,'stuffBorrowSum')
                  var params1 = new URLSearchParams();
                  var borrowMoney = parseFloat(res.data.data);
                  // params1.append('borrow_money', res.data.data);
                  params1.append('borrow_money', borrowMoney);
                  console.log(borrowMoney,'borrowMoney')
                  // this.patchStuff(this.temp.stuff_id,params)
                    axios({
                      method:'patch',
                      url:'http://localhost/father/api/web/v2/stuffs/1',
                      data:params1
                    })
            })
            // this.list.unshift(this.temp)

            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '借款已记录',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.resetTemp();
      this.copyTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.stuff_id = this.copyTemp.id // mock a id
          this.temp.stuffname = this.copyTemp.stuffname // mock a id
          this.temp.type = 'borrow'
          this.temp.remark = this.copyTemp.remark
          this.temp.money = this.temp.money===0?0:-Math.abs(this.temp.money)
          createArticle(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '还款已记录',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDetail(row){
      console.log(row)
      this.dialogDetailVisible = true
      fetchDetailList(row.id).then((res) => {
            this.gridData = res.data.data
            // this.dialogDetailVisible = false
            this.$notify({
              title: '成功',
              message: '获取详情',
              type: 'success',
              duration: 2000
            })
          })
    },
    patchStuff(id,borrowMoney) {
      debugger
      console.log(id,borrowMoney)
      patchStuff(id,borrowMoney).then((res)=>{
        console.log('patchStuffSucess')
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
