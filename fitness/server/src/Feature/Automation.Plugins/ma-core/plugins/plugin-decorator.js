export function Plugin(pluginConfig) {
    return function (pluginConstructor) {
        pluginConfig.activityDefinitions.forEach(function (activityDefinitions) {
            activityDefinitions.id = activityDefinitions.id.toLowerCase();
        });
        pluginConstructor._pluginConfig = pluginConfig;
    };
}
//# sourceMappingURL=plugin-decorator.js.map