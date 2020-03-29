import { Component, OnInit, PipeTransform } from "@angular/core";
import { Covid } from "./covid";
import { ApiserivceService } from "../service/apiserivce.service";
import { Observable } from "rxjs";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { DecimalPipe } from "@angular/common";
import { startWith, map } from "rxjs/operators";
import { CovidBarChart } from "./covid-bar-chart";

@Component({
  selector: "app-covid",
  templateUrl: "./covid.component.html",
  styleUrls: ["./covid.component.css"],
  providers: [DecimalPipe]
})
export class CovidComponent implements OnInit {
  covidObjs: Observable<Covid[]>;
  obj = new FormControl("");
  originalData: Covid[];

  frmGroup: FormGroup;

  covidBarChart: CovidBarChart[] = [];
  view: any[] = [1500, 2500];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = "Country";
  showYAxisLabel: boolean = true;
  xAxisLabel: string = "Infected Cases";
  barPadding: number = 2;
  colorScheme = {
    domain: []
  };

  constructor(
    private apiService: ApiserivceService,
    private pipe: DecimalPipe,
    private fb: FormBuilder
  ) {
    this.frmGroup = fb.group({
      obj: []
    });
  }

  ngOnInit() {
    this.apiService.getCoronaInformation().subscribe((data: Covid[]) => {
      data.forEach((obj: Covid) => {
        this.covidBarChart.push({ name: obj.country, value: obj.cases });
        const hexColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
        this.colorScheme.domain.push(hexColor);
      });
      this.originalData = data;
      this.frmGroup.get("obj").valueChanges.subscribe(x => console.log(x));
      if (this.originalData && this.originalData.length > 0) {
        this.covidObjs = this.frmGroup.get("obj").valueChanges.pipe(
          startWith(""),
          map(text => this.search(text, this.pipe, this.originalData))
        );
      }
    });
  }
  search(text: string, pipe: PipeTransform, covids: Covid[]): any[] {
    return covids.filter((covid: Covid) => {
      const term = text.toLowerCase();
      return (
        (covid.country && covid.country.toLowerCase().includes(term)) ||
        (covid.cases && pipe.transform(covid.cases).includes(term)) ||
        (covid.todayCases && pipe.transform(covid.todayCases).includes(term)) ||
        (covid.deaths && pipe.transform(covid.deaths).includes(term)) ||
        (covid.todayDeaths &&
          pipe.transform(covid.todayDeaths).includes(term)) ||
        (covid.recovered && pipe.transform(covid.recovered).includes(term)) ||
        (covid.active && pipe.transform(covid.active).includes(term)) ||
        (covid.critical && pipe.transform(covid.critical).includes(term)) ||
        (covid.casesPerOneMillion &&
          pipe.transform(covid.casesPerOneMillion).includes(term)) ||
        (covid.deathsPerOneMillion &&
          pipe.transform(covid.deathsPerOneMillion).includes(term))
      );
    });
  }
  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
}
