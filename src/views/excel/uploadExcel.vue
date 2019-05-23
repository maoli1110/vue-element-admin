<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { InsertArticleBatchSql,InsertStuffBatchSql } from '@/api/article'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      console.log(this.tableData,'tableData')
      // console.log(JSON.stringify(this.tableData),'tableData')
      var tableAticleResult =[];
      var tableStuffResult = [];
      this.tableData.forEach((value ,key)=>{
        tableAticleResult[key]=[];
        tableAticleResult[key].push(value.stuff_id)
        tableAticleResult[key].push(value.stuffname)
        tableAticleResult[key].push(value.type)
        tableAticleResult[key].push(value.money)
        tableAticleResult[key].push(value.remark)
      })
      this.tableData.forEach((value ,key)=>{
        tableStuffResult[key]=[];
        tableStuffResult[key].push(value.stuffname)
        tableStuffResult[key].push(value.money)
      })
      InsertArticleBatchSql(tableAticleResult).then(res=>{
        console.log(res,'InsertArticleBatchSql')
      })
      InsertStuffBatchSql(tableStuffResult).then(res=>{
        console.log(res,'InsertStuffBatchSql')
      })
    }
  }
}
</script>
