import { Component, OnInit } from "@angular/core";
import { Covid } from "./covid";
import { ApiserivceService } from "../service/apiserivce.service";

@Component({
  selector: "app-covid",
  templateUrl: "./covid.component.html",
  styleUrls: ["./covid.component.css"]
})
export class CovidComponent implements OnInit {
  constructor(private apiService: ApiserivceService) {}

  ngOnInit() {
    this.apiService.getCoronaInformation().subscribe((data: Covid[]) => {
      console.log(data);
    });
  }
}
