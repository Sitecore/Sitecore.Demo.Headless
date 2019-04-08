import { Component, OnInit, Injector } from "@angular/core";
import { EditorBase } from "@sitecore/ma-core";

@Component({
  selector: "readonly-editor",
  template: `
    <section class="content">
      <div class="form-group">
        <div class="row readonly-editor">
          <label class="col-6 title">Notification title</label>
          <div class="col-6"></div>
        </div>
        <div class="row">
          <div class="col-12">
            <input
              type="text"
              class="form-control"
              [(ngModel)]="title"
            />
          </div>
        </div>
        <div class="row">
          <p></p>
        </div>
        <div class="row readonly-editor">
          <label class="col-12 title">Notification body</label>
        </div>
        <div class="row">
          <div class="col-12">
            <input
                type="text"
                class="form-control"
                [(ngModel)]="body"
              />
          </div>
        </div>
      </div>
    </section>
  `,
  //CSS Styles are ommitted for brevity
  styles: [""]
})
export class PushNotificationActivityEditorComponent extends EditorBase implements OnInit {
  constructor(private injector: Injector) {
    super();
  }

  title: Text;
  body: Text;

  ngOnInit(): void {
    this.title = this.model.title || "Hey $first_name$!";
    this.body = this.model.body || "Thanks for registering for the event, it will be outstanding.";
  }

  serialize(): any {
    return {
      title: this.title,
      body: this.body
    };
  }
}