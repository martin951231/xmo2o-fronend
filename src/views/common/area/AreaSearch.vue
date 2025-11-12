<template>
  <div>
    <a-input-group compact>
      <a-select
        :default-value="search.provinceId"
        v-model="search.provinceId"
        style="width:115px;"
        @change="handleProvinceChange"
        v-if="showProvince"
      >
        <a-select-option
          v-for="province in provinceData"
          :key="province.area_id"
        >{{ province.area_name }}</a-select-option>
      </a-select>
      <a-select
        v-model="search.cityId"
        style="width:115px;"
        @change="handleCityChange"
        v-if="showCity"
      >
        <a-select-option v-for="city in cityData" :key="city.area_id">{{ city.area_name }}</a-select-option>
      </a-select>
      <a-select
        v-model="search.areaId"
        style="width:115px;"
        @change="handleAreaChange"
        v-if="showArea"
      >
        <a-select-option v-for="area in areaData" :key="area.area_id">{{ area.area_name }}</a-select-option>
      </a-select>

      <a-select
              v-model="search.streetId"
              style="width:115px;"
              @change="handleSteetChange"
              v-if="showStreet"
      >
        <a-select-option v-for="street in streetData" :key="street.area_id">{{ street.area_name }}</a-select-option>
      </a-select>
    </a-input-group>
  </div>
</template>
<script>
const provinceData = [
  {
    area_id: '0',
    area_name: '请选择省份',
  },
]
const cityData = [
  {
    area_id: '0',
    area_name: '请选择城市',
  },
]
const areaData = [
  {
    area_id: '0',
    area_name: '请选择区域',
  },
]

const streetData = [
  {
    area_id: '0',
    area_name: '请选择乡镇',
  },
]
import areaPlatformApi from '@/api/common/platform/area.js'
export default {
  data() {
    return {
      provinceData,
      showProvince: 0,
      cityData,
      showCity: 0,
      areaData,
      showArea: 0,
      streetData,
      showStreet: 0,
      search: {
        provinceId: '0',
        cityId: '0',
        areaId: '0',
        streetId: '0'
      },
    }
  },
  mounted() {
    this.getProvince()
    this.getCity()
    this.getArea()
    this.getStreet()
  },
  methods: {
    handleProvinceChange(value) {
      this.search.provinceId = value
      this.search.cityId = '0'
      this.search.areaId = '0'
      this.search.streetId = '0'
      this.getCity()
      this.$emit('handleSelect', this.search)
    },
    handleCityChange(value) {
      this.search.cityId = value
      this.search.areaId = '0'
      this.search.streetId = '0'
      this.getArea()
      this.$emit('handleSelect', this.search)
    },
    handleAreaChange(value) {
      this.search.areaId = value
      this.search.streetId = '0'
      this.getStreet()
      this.$emit('handleSelect', this.search)
      console.log(value)

    },
    handleSteetChange(value) {
      this.search.streetId = value
      this.$emit('handleSelect', this.search)
    },
    //获得省份
    getProvince() {
      this.request(areaPlatformApi.getSelectProvince).then((res) => {
        console.log(res)
        if (res.error == 0) {
          this.provinceData = [
            {
              area_id: '0',
              area_name: '请选择省份',
            },
          ]
          this.provinceData = this.provinceData.concat(res.list)
          this.showProvince = 1
          console.log(this.provinceData)
        } else if (res.error == 2) {
          this.provinceData = res.list
          this.showProvince = 1
        }
      })
    },
    //获得城市
    getCity() {
      this.request(areaPlatformApi.getSelectCity, { id: this.search.provinceId }).then((res) => {
        console.log(res)
        this.cityData = [
          {
            area_id: '0',
            area_name: '请选择城市',
          },
        ]

        this.areaData = [
          {
            area_id: '0',
            area_name: '请选择区域',
          },
        ]
        if (res.error == 0) {
          this.cityData = this.cityData.concat(res.list)
          this.showCity = 1
        } else if (res.error == 1) {
          this.showCity = 1
        } else if (res.error == 2) {
          this.cityData = res.list
          this.showCity = 1
        }
      })
    },
    //获得城区域
    getArea() {
      let searchParam = {
        id: this.search.cityId,
      }
      this.request(areaPlatformApi.getSelectArea, searchParam).then((res) => {
        this.areaData = [
          {
            area_id: '0',
            area_name: '请选择区域',
          },
        ]
        if (res.error == 0) {
          this.areaData = this.areaData.concat(res.list)
          this.showArea = 1
        } else if (res.error == 2) {
          this.areaData = res.list
          this.showArea = 1
        }
      })
    },
    //获取乡镇
    getStreet() {
      this.request(areaPlatformApi.getSelectStreet, { id: this.search.areaId }).then((res) => {
        console.log(res)
        this.streetData = [
          {
            area_id: '0',
            area_name: '请选择乡镇',
          },
        ]
        if (res.error == 0) {
          this.streetData = this.streetData.concat(res.list)
          this.showStreet = 1
        } else if (res.error == 1) {
          this.showStreet = 1
        } else if (res.error == 2) {
          this.streetData = res.list
          this.showStreet = 1
        }
      })
    },
  },
}
</script>
