import { Component, Inject, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { findIndex } from "lodash";

@Component({
  selector: 'app-charts-modal',
  templateUrl: './charts-modal.component.html',
  styleUrls: ['./charts-modal.component.scss']
})
export class ChartsModalComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Count',
      backgroundColor: '#357CA2',
      borderColor: '#2C6685',

      hoverBackgroundColor: '#2C6685',
      hoverBorderColor: '#172B53'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<ChartsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    let labelCountMap = [];
    this.data.map(dataItem => {
      let content = dataItem.content;
        content = content.replace(/<[^>]*>/g, '');
        if (findIndex(labelCountMap, { label: content }) >= 0) {
          labelCountMap[findIndex(labelCountMap, { label: content })].count++;
        } else {
          labelCountMap.push({ label: content, count: 1 })
        }
        return content;
    });
    this.barChartLabels = labelCountMap.map(item => item.label);
    this.barChartData[0].data = labelCountMap.map(item => item.count);
  }

}
