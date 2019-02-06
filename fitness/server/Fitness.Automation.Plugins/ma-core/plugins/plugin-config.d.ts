import { NgModuleFactory, Type } from '@angular/core';
import { ItemBase } from '../activities/items/ItemBase';
import { EditorBase } from '../editors/editor-base';
export interface ActivityDefinition {
    id: string;
    activity: Type<ItemBase>;
    editorComponenet: Type<EditorBase>;
    editorModuleFactory: NgModuleFactory<any>;
}
export interface PluginConfig {
    activityDefinitions: ActivityDefinition[];
}
