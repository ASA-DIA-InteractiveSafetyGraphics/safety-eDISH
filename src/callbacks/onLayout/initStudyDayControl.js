import initPlayButton from './initStudyDayControl/initPlayButton';

export default function initStudyDayControl() {
    var chart = this;
    var config = this.config;

    // Move the study day control beneath the chart
    chart.controls.secondary = chart.wrap
        .insert('div', 'div.footnote')
        .attr('class', 'wc-controls secondary-controls');

    var removed = chart.controls.wrap
        .selectAll('div')
        .filter(controlInput => controlInput.label === 'Study Day')
        .remove();

    chart.controls.studyDayControlWrap = chart.controls.secondary.append(function() {
        return removed.node();
    });

    //convert control to a slider
    chart.controls.studyDayInput = chart.controls.studyDayControlWrap.select('input');
    chart.controls.studyDayInput.attr('type', 'range');

    //set min and max values and add annotations
    chart.controls.studyDayRange = d3.extent(
        chart.imputed_data.filter(f => f.key_measure),
        d => d[config.studyday_col]
    );
    chart.controls.studyDayInput.attr('min', chart.controls.studyDayRange[0]);
    chart.controls.studyDayInput.attr('max', chart.controls.studyDayRange[1]);

    chart.controls.studyDayControlWrap
        .insert('span', 'input')
        .attr('class', 'span-description')
        .style('display', 'inline-block')
        .style('padding-right', '0.2em')
        .text(chart.controls.studyDayRange[0]);
    chart.controls.studyDayControlWrap
        .append('span')
        .attr('class', 'span-description')
        .style('display', 'inline-block')
        .style('padding-left', '0.2em')
        .text(chart.controls.studyDayRange[1]);

    //initialize plot_day to day 0 or the min value, whichever is greater
    if (config.plot_day === null) {
        config.plot_day = chart.controls.studyDayRange[0] > 0 ? chart.controls.studyDayRange[0] : 0;
        chart.controls.studyDayInput.node().value = config.plot_day;
    }

    initPlayButton.call(this);
}
