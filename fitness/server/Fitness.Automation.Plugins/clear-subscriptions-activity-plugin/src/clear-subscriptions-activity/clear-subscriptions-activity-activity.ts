import { SingleItem } from "@sitecore/ma-core";

export class ClearSubscriptionActivity extends SingleItem {
  getVisual(): string {
    const subTitle = "Clear event subscriptions";
    const cssClass = this.isDefined ? "" : "undefined";

    return `
            <div class="viewport-readonly-editor marketing-action ${cssClass}">
                <span class="icon">
                    <img src="/~/icon/OfficeWhite/32x32/delete.png" />
                </span>
                <p class="text with-subtitle" title="Clear event subscriptions">
                    Clear event subscriptions
                    <small class="subtitle" title="${subTitle}">${subTitle}</small>
                </p>
            </div>
        `;
  }

  get isDefined(): boolean {
    return true;
  }
}
