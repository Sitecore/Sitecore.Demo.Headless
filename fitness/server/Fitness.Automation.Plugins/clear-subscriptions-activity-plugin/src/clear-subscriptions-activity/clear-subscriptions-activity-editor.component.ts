import { Component, OnInit, Injector } from "@angular/core";
import { EditorBase } from "@sitecore/ma-core";

@Component({
  selector: "readonly-editor",
  template: ``,
  styles: [""]
})
export class ClearSubscriptionActivityEditorComponent extends EditorBase implements OnInit {
  constructor(private injector: Injector) {
    super();
  }

  ngOnInit(): void {
  }

  serialize(): any {
    return {};
  }
}
