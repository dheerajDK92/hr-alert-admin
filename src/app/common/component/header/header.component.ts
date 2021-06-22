import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { MorePopOverComponent } from "../more-pop-over/more-pop-over.component";
import { MenuController } from "@ionic/angular";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  constructor(
    private popoverController: PopoverController,
    public menuCtrl: MenuController
  ) {}
  @Input("headerText") headerText: any;
  ngOnInit() {}

  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MorePopOverComponent,
      event: ev,
      componentProps: { page: this.headerText },
      translucent: true,
      animated: true,
    });
    return await popover.present();
  }

  toggleHeaderMenu() {
    this.menuCtrl.toggle();
  }
  
}
