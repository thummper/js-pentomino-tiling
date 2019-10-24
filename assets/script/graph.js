class Graph{
    constructor(baseOptions, graphOptions){
        this.baseOptions  = baseOptions;
        this.graphOptions = graphOptions;
       
        this.chart        = null
        this.init();
    }

    init(){
        let element = this.graphOptions.element;
        let chart   = echarts.init(element);
        let options = this.getOptions();
        chart.setOption(options);
        this.chart = chart;
    }

    getFigs(data){
        let figures = [];
        for(let i = 0; i < data.length; i++){
            let d = data[i];
            figures.push(d[0]);
        }
        return figures;
    }

    getLabels(data){
        let figures = [];
        for(let i = 0; i < data.length; i++){
            let d = data[i];
            figures.push(d[1]);
        }
        return figures;
    }

    getOptions(){
        let base       = this.baseOptions;
        let additional = this.graphOptions;
        base.title.text = additional.title;
        base.yAxis      = additional.yAxis;
        base.xAxis      = additional.xAxis;
        base.series     = additional.series;
       

        
        for(let i = 0; i < additional.xAxis.length; i++){
            let x = additional.xAxis[i];
            let data = x.d;
            // Need to break data down into figures.
            data = this.getLabels(data);
            base.xAxis[i].data = data;
        }

        for(let i = 0; i < additional.series.length; i++){
            let x = additional.series[i];

            let data = x.d;
            // Need to break data down into figures.
            data = this.getFigs(data);
            base.series[i].data = data;
        }
     
        return base;
    }

    update(){
        this.init();
        this.chart.resize();
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