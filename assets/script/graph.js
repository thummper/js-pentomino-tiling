class Graph{
    constructor(element, options, data){
        this.element = element;
        this.options = options;
        this.chart = null;
        this.data = data;

    }

    init(){
        this.chart = echarts.init(this.element);
        this.chart.setOption(this.options);
      
    }
    update(){
        console.log("Updating: ", this.options);
        let data = this.data;
        let labels = [];
        let series = [];
        //TODO. Looping through this is bad.
        for(let i = 0; i < this.data.length; i++){
            let dataset = data[i];
            series.push(dataset[0]);
            labels.push(dataset[1]);
        }
        
        this.options.series[0].data = series;
        this.options.xAxis.data = labels;

        this.init();
    }

}


// option = {
//     title: {
//         text: 'Step Line'
//     },
//     tooltip: {
//         trigger: 'axis'
//     },
//     legend: {
//         data:['Step Start', 'Step Middle', 'Step End']
//     },
//     grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//     },
//     toolbox: {
//         feature: {
//             saveAsImage: {}
//         }
//     },
//     xAxis: {
//         type: 'category',
//         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//         type: 'value'
//     },
//     series: [
//         {
//             name:'Step Start',
//             type:'line',
//             step: 'start',
//             data:[120, 132, 101, 134, 90, 230, 210]
//         },
//         {
//             name:'Step Middle',
//             type:'line',
//             step: 'middle',
//             data:[220, 282, 201, 234, 290, 430, 410]
//         },
//         {
//             name:'Step End',
//             type:'line',
//             step: 'end',
//             data:[450, 432, 401, 454, 590, 530, 510]
//         }
//     ]
// };