import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { SidebarService } from '@app/services/sidebar.service';

@Component({
  selector: 'app-block-header',
  templateUrl: './block-header.component.html',
  styleUrls: ['./block-header.component.scss']
})
export class BlockHeaderComponent implements OnInit {
  public visitorsOptions: EChartOption = {};
  public visitsOptions: EChartOption = {};
  public sidebarVisible = true;
  public data: any = {};

  @Input() title = '';
  @Input() breadcrumbItem: any;

  constructor(private sidebarService: SidebarService, private cdr: ChangeDetectorRef) {
    this.visitorsOptions = this.loadLineChartOptions([3, 5, 1, 6, 5, 4, 8, 3], '#49c5b6');
    this.visitsOptions = this.loadLineChartOptions([4, 6, 3, 2, 5, 6, 5, 4], '#f4516c');
  }

  ngOnInit() {
    console.log('breadcrumbItem', this.breadcrumbItem);
  }

  toggleFullWidth() {
    this.sidebarService.toggle();
    this.sidebarVisible = this.sidebarService.getStatus();
    this.cdr.detectChanges();
  }

  loadLineChartOptions(data: any, color: any) {
    let chartOption: EChartOption;
    const xAxisData: Array<any> = new Array<any>();

    data.forEach((element: any) => {
      xAxisData.push('');
    });

    return (chartOption = {
      xAxis: {
        type: 'category',
        show: false,
        data: xAxisData,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any, ticket: any, callback: any) {
          return (
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
            color +
            ';"></span>' +
            params[0].value
          );
        }
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        containLabel: false
      },
      series: [
        {
          data: data,
          type: 'line',
          showSymbol: false,
          symbolSize: 1,
          lineStyle: {
            color: color,
            width: 1
          }
        }
      ]
    });
  }
}
