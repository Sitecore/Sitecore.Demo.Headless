import { SingleItem } from "@sitecore/ma-core";

export class PushNotificationActivity extends SingleItem {
  getVisual(): string {
    const subTitle = "Send Push Notification";
    const cssClass = this.isDefined ? "" : "undefined";
    return `
            <div class="viewport-readonly-editor marketing-action ${cssClass}">
                <span class="icon">
                    <img src="/~/icon/OfficeWhite/32x32/mobile_phone.png" />
                </span>
                <p class="text with-subtitle" title="Send Push Notification">
                Send Push Notification
                    <small class="subtitle" title="${subTitle}">${subTitle}</small>
                </p>
            </div>
        `;
  }

  get isDefined(): boolean {
    return true;
  }
}
