import { execute } from "./GenericService";

export function subscribe(subscriptionId) {
  return executeAction("subscribe", subscriptionId);
}

export function unsubscribe(subscriptionId) {
  return executeAction("unsubscribe", subscriptionId);
}

function executeAction(eventAction, subscriptionId) {
  if (!subscriptionId) {
    throw new Error("subscribe is not specified");
  }
  return execute(`/subscriptions/${eventAction}`, { SubscriptionId: subscriptionId });
}