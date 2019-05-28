import { Component, Input, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-detail-tiles',
  templateUrl: './detail-tiles.component.html',
  styleUrls: ['./detail-tiles.component.scss']
})
export class DetailTilesComponent implements OnInit {
  @Input() title = '';
  @Input() value = '';
  @Input() details = '';
  @Input() chartOptions: EChartOption = {};

  constructor() {}

  ngOnInit() {}
}
