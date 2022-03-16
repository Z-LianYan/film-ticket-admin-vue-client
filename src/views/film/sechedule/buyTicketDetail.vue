<template>
  <el-dialog
    :title="selectedSchedule.cinema_name"
    :visible.sync="isDrawer"
    width="70%"
    @close="drawerClose"
    center
  >
    <el-form
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="电影" prop='film_name'>
            {{selectedSchedule.film_name}} <el-button type="text">{{selectedSchedule.language}}</el-button> <el-tag>{{selectedSchedule.play_type_name}}</el-tag>
          </el-form-item>
          <!-- <el-form-item label="语言" prop='language'>
            {{selectedSchedule.language}}
          </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <el-form-item label="放映时间" prop='start_runtime'>
            {{handleWeek(dayjs(selectedSchedule.start_runtime).day())}} {{dayjs(selectedSchedule.start_runtime).format("YYYY-MM-DD HH:mm")}} 
          </el-form-item>
          <!-- <el-form-item label="放映类型" prop='play_type_name'>
            {{selectedSchedule.play_type_name}}
          </el-form-item> -->
        </el-col>
      </el-row>
    </el-form>

    <div class="select-seat-buy-ticket-box">
        <ul 
        class="section-price-wrapper" 
        v-if="selectedSchedule.is_section == 1">
          <li 
          class="section-item" 
          v-for="(item,index) in selectedSchedule.sectionPrice"
          :key="index">
            <div
              class="section-icons"
              :style='{
                background: `url(${
                  item.section_id == "a"
                    ? sectionA
                    : item.section_id == "b"
                    ? sectionB
                    : item.section_id == "c"
                    ? sectionC
                    : item.section_id == "d"
                    ? sectionD
                    : null
                }) no-repeat`,
              }'
            ></div>
            <div class="name-price">
              <div>{{item.section_name}}</div>
              <div class="price">¥{{(Number(item.price)+selectedSchedule.premium)|currencyFormat}}</div>
            </div>
          </li>
        </ul>

      <div class="seats-box">
          <div
            class="screen-wrapper"
            v-if="selectedSchedule.hall_name"
          >
            <div class="screen-icon">
              {{selectedSchedule.hall_name +
                "/" +
                selectedSchedule.hall_type_name}}
            </div>
          </div>

          <div
            class="row-num-list"
            :style='{
              height: cellWidth/2 * hallDetail.seat_row_num + "vw",
            }'
          >
            <div
              v-for="(item,index) in seat_real_rows"
              :key="index"
              class="row"
              :style='{
                height: cellWidth/2 + "vw",
                top: cellWidth/2 * (item.row - 1) + "vw",
                // fontSize: cellWidth * 0.2 + "vw",
              }'
            >
              <div class="cell">{{item.row_id}}</div>
            </div>
          </div>

        <ul
          class="seat-list"
          :style='{
            height: cellWidth/2 * hallDetail.seat_row_num + "vw",
          }'
        >
          <div
            class="middle-line"
            :style='{ height: cellWidth/2 * hallDetail.seat_row_num + "vw" }'
          ></div>
          <li
            class="cell"
            v-for="(item,index) in seatList"
            :key="index"
            :style='{
              width: cellWidth + "%",
              height: cellWidth/2 + "vw",
              top: cellWidth/2 * item.row - cellWidth/2 + "vw",
              left: cellWidth * item.column - cellWidth + "%",
            }'
          >
            <div
              class="icons"
              :style='{
                width: "70%",
                height: "70%",
                backgroundImage: `url(${
                  already_sale_seat.includes(item.id)
                    ? alreadySaleIcon
                    : item.disabled == 0
                    ? handleSelectedSeat(item)
                      ? selectedIcon
                      : selectedSchedule.is_section == 1
                      ? item.section_id == "a"
                        ? sectionA
                        : item.section_id == "b"
                        ? sectionB
                        : item.section_id == "c"
                        ? sectionC
                        : item.section_id == "d"
                        ? sectionD
                        : noSelectedIcon
                      : noSelectedIcon
                    : item.disabled == 1
                    ? disableIcon
                    : null
                })`,
              }'
            ></div>
          </li>
        </ul>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import noSelectedIcon from "@/assets/images/film/no-selected.png";
import disableIcon from "@/assets/images/film/disable.png";
import alreadySaleIcon from "@/assets/images/film/already-sale.png";
import selectedIcon from "@/assets/images/film/selected.png";
import sectionA from "@/assets/images/film/sectionA.png";
import sectionB from "@/assets/images/film/sectionB.png";
import sectionC from "@/assets/images/film/sectionC.png";
import sectionD from "@/assets/images/film/sectionD.png";
export default {
  name: "BuyTicketDetail",
  components: {},
  props:{
    
  },
  computed:{
    
  },
  watch:{
    // "ruleForm.sectionPrice":{
    //   handler(val){
    //   },
    //   deep: true, //true 深度监听
    //   // 加上immediate选项后，实例化后立刻回调一次
    //   immediate: true
    // }
  },
  data() {
    return {
      noSelectedIcon,
      disableIcon,
      alreadySaleIcon,
      selectedIcon,
      sectionA,
      sectionB,
      sectionC,
      sectionD,
      isDrawer: false,
      selectedSchedule:{},
      seatList:[],
      already_sale_seat:[],
      selectedSeat:[],
      hallDetail:{},
      seat_real_rows:[],

      cellWidth:0
      
    };
  },
  mounted() {
  },
  methods: {
    dayjs,
    handleSelectedSeat(item) {
      let { selectedSeat } = this;
      let flag = false;
      for (let i = 0; i < selectedSeat.length; i++) {
        if (selectedSeat[i].id === item.id) {
          flag = true;
        }
      }
      return flag;
    },
    handleWeek(day) {
      switch (day) {
        case 0:
          return "周日";
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        default:
          return "";
      }
    },
    getDetail(){
      let { id,hall_id } = this.selectedSchedule;
      this.$store.dispatch("schedule/getSeatList", {
        schedule_id:id,
        hall_id
      }).then((res) => {
        // console.log('res',res);
        // this.hallList = res.data;
        this.seatList = res.seat;
        this.already_sale_seat = res.already_sale_seat;
        this.cellWidth = 100 / res.seat_column_num;
        this.hallDetail=res;

        let seat_real_rows = [];
        let obj = {};
        for (let item of this.seatList) {
          if (!obj[item.row_id]) {
            obj[item.row_id] = true;
            seat_real_rows.push({
              row: item.row, //生成座位时的排号
              row_id: item.row_id, //真实座位排号
            });
          }
        }

        this.seat_real_rows = seat_real_rows;


        this.isDrawer = true;
      });
    },

    
    open(row) {
      // console.log('selectedSchedule',row)
      this.selectedSchedule = row;
      this.getDetail();
      
    },
    drawerClose() {
      
    },
  },
};
</script>

<style lang="scss" scoped>
.select-seat-buy-ticket-box{
    // height: 100%;
    background-color: #eee;
    // display: flex;
    // flex-flow: column;
    // .no-select-seat{
    //     color: #cfcbcb;
    //     // background-color: red;
    // }
    // .sale-out-seat{
    //     color: #ff5f16;
    // }
    // .can-select{
    //     // color: #fff;
    // }
    // .selected-seat{
    //     color: rgb(49, 188, 73);
    // }
    // .notice-bar-content-detail{
    //     position: absolute;
    //     top: 0.28rem;
    //     left: 0;
    //     right: 0;
    //     background:#fff9ed;
    //     font-size: 0.13rem;
    //     padding: 0 0.25rem 0.1rem 0.25rem;
    //     z-index: 100000000000;
    //     .notice-title{
    //         font-size: 0.13rem;
    //         height: 0.27rem;
    //         position: absolute;
    //         left: 0.32rem;
    //         right: 0.3rem;
    //         top: -0.28rem;
    //         background:#fff9ed;
    //     }
    //     .detail-content{
    //         display: flex;
    //         margin-bottom: 0.05rem;
    //         &::before{
    //             content: "·";
    //             height: 0.18rem;
    //             line-height: 0.18rem;
    //             margin-right: 0.03rem;
    //         }
    //         .content{
    //             line-height: 0.20rem;
    //         }
    //     }
    // }
    .section-price-wrapper{
        padding: 10px 15px 10px 15px;
        background-color: #fff;
        display: flex;
        align-items: center;
        .section-item{
            display: flex;
            align-items: center;
            margin-right: 10px;
            .section-icons{
                width: 30px;
                height: 30px;
                background-size: 100% 100% !important;
                // margin-right: 10px;
            }
            .name-price{
                font-size: 16px;
                margin-left: 10px;
                .price{
                    color: red;
                }
            }
        }
    }
    .seats-box{
        // flex: 1;
        // height: 300px;
        // overflow: hidden;
        position: relative;
        user-select: none;
        .screen-wrapper{
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            // position: absolute;
            top: 0;
            z-index: 10;

            .screen-icon{
                padding-top: 10px;
                width: 300px;
                height: 30px;
                // transform: translateX(-50%);
                background: url('../../../assets/images/film/screen.png') no-repeat;
                background-size: contain;
                text-align: center;
                font-size: 13px;
                
                // background-color: #eee;
            }
        }
        
        .row-num-list{
            width: 20px;
            background-color: #ccc;
            opacity: 0.8;
            text-align: center;
            border-radius: 5px;
            display: flex;
            flex-flow: column;
            position: absolute;
            left: 10px;
            z-index: 100;
            .row{
                width: 100%;
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                .cell{
                    height: 70%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
        .seat-list{
            width: 100%;
            position: relative;
            // animation-name: seatList;
            // animation-duration: 3s;
            // @keyframes seatList {
            //     from { 
            //         background: red;
            //         transform: scale(1,1);
            //     }
            //     to { 
            //         background: #ccc;
            //         transform: scale(1.2,1.2);
            //     }
            // }
            .middle-line{
                // width: 0.2rem;
                // height: 0.5rem;
                border-right: 1px dashed #ccc;
                position: absolute;
                left: 50%;
                z-index: 1000;
                transform: translateX(-50%);
            }
            .cell{
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                // width: 25px;
                // height: 25px;
                // background-image: url('../../static/img/no-selected.png');
                // background-size: 100% 100%;
                .icons{
                    // background-image: url('../../static/img/no-selected.png');
                    background-size: 100% 100%;
                }
                .seat{
                    // font-size: 0.25rem;
                }
            }
            
        }
    }
    
    .bottom-wrapper{
        padding-bottom: 37px;
        .seat-template-status{
            display: flex;
            justify-content: center;
            padding-top: 10px;
            .status-item{
                margin-right: 10px;
                display: flex;
                align-items: center;
                .icons{
                    width: 20px;
                    height: 2px;
                    // font-size: 0.30rem;
                    margin-right: 8px;
                    background-size: 100% 100%;
                    // &::before{
                    //   background-color: #ff5f16;  
                    //   border-radius: 0.05rem;
                    // }
                }
                .txt{
                    font-size: 13px;
                    color: #797d82;
                }
                
            }
            .status-item:nth-last-child(1){
                margin-right: 0;
            }
        }
        .top-box{
            margin: 10px;
            padding: 15px 10px 15px 10px;
            background: #fff;
            border-radius: 5px;
            .film-detail{
                padding-bottom: 10px;
                .top{
                    display: flex;
                    justify-content: space-between;
                    .film-name{
                        color: #191a1b;
                        font-size: 15px;
                    }
                    .right{
                        color: #ff5f16;
                        font-size: 13px;
                    }
                }
                .bot{
                    font-size: 13px;
                    line-height: 19px;
                    margin-top: 4px;
                    color: #797d82;
                }
            }
            .shedule-wrapper{
                margin-bottom: 10px;
                display: flex;
                overflow-y: hidden;
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE 10+ */
                &::-webkit-scrollbar {
                  display: none; /* Chrome Safari */
                }
                // border-bottom: 0.01rem solid #f4f4f4;
                
                .she-item{
                    width: 7px;
                    height: 6px;
                    background-color: hsla(0,0%,95.7%,.6);
                    display: flex;
                    flex-flow: column nowrap;
                    align-items: center;
                    justify-content: center;
                    border-radius: 5px;
                    margin-right: 10px;
                    &.active-schedule-item{
                        border: 1px solid red;
                        background-color: #fffbfb;
                    }
                    .time{
                        font-size: 14px;
                        color: #191a1b;
                        line-height: 17px;
                    }
                    .language{
                        font-size: 10px;
                        color: #bdc0c5;
                        width: 70px;
                        line-height: 14px;
                        // @include ellipsis-one();
                        margin-top: 1px;
                        text-align: center;
                    }
                    .price{
                        font-size: 13px;
                        color: #797d82;
                    }
                }
            }
            .line{
                height: 10px;
                background-color: #f4f4f4;
            }
            .selected-seat-list{
                padding: 1px 0 0 0;
                overflow-y: hidden;
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE 10+ */
                &::-webkit-scrollbar {
                  display: none; /* Chrome Safari */
                }
                display: flex;
                .seat{
                    width: 100px;
                    padding: 4px 1px;
                    display: flex;
                    justify-content: space-between;
                    background-color: hsla(0,0%,95.7%,.6);
                    border-radius: 5px;
                    margin-right: 10px;
                    .left{
                        margin-right: 10px;
                        .seat-txt{
                            font-size: 14px;
                            color: #191a1b;
                            white-space: nowrap;
                        }
                        .price{
                            font-size: 13px;
                            color: rgb(250, 182, 70);
                        }
                    }
                    .right{
                        display: flex;
                        align-items: flex-end;
                    }
                }
            }
        }
    }
    .select-seat-buy-btn-box{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        .select-seat-buy-btn{
            
        }
    }
    
    
}
</style>
