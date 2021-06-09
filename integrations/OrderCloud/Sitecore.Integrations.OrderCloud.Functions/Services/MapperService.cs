using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json.Linq;

using OrderCloud.SDK;

using Sitecore.Integrations.OrderCloud.Functions.Models.M;
using Sitecore.Integrations.OrderCloud.Functions.Models.Mappings;

using Stylelabs.M.Base.Querying;
using Stylelabs.M.Base.Querying.Filters;
using Stylelabs.M.Base.Querying.Linq;
using Stylelabs.M.Sdk.Contracts.Base;
using Stylelabs.M.Sdk.Contracts.Querying;
using Stylelabs.M.Sdk.WebClient;
using Stylelabs.M.Sdk.WebClient.Extensions;

namespace Sitecore.Integrations.OrderCloud.Functions.Services
{
    public class MapperService
    {
        private readonly IWebMClient _client;

        private readonly ILogger _log;

        public MapperService(IWebMClient client, ILogger log)
        {
            _client = client;
            _log = log;
        }

        public async Task<MapResult> MapProduct(long id, EntityMapping mapping)
        {
            MapResult result = new MapResult();
            IEntity mainEntity = await _client.Entities.GetAsync(id);
            result.Product.ID = mainEntity.Identifier;
            MapProperties(mainEntity, result, mapping.PropertyMappings);
            MapExtensionData(mainEntity, result.Product, mapping.ExtensionDataMappings);
            await MapRelations(mainEntity, result, mapping.RelationMappings);

            return result;
        }

        private static string StripComplexitySegment(string s)
        {
            string result = s;
            int index = s.IndexOf('.');
            if (index >= 0 && index + 1 < s.Length)
            {
                index++;
                result = s.Substring(index, s.Length - index);
            }

            return result;
        }

        private static dynamic ReadDynamicProperty(ExpandoObject expando, string name)
        {
            dynamic result = null;
            IDictionary<string, object> dictionary = expando;
            if (dictionary.ContainsKey(name))
            {
                result = dictionary[name];
            }

            return result;
        }

        private static void WriteDynamicProperty(ExpandoObject expando, string name, object value)
        {
            IDictionary<string, object> dictionary = expando;
            if (dictionary.ContainsKey(name))
            {
                dictionary[name] = value;
            }
            else
            {
                dictionary.Add(name, value);
            }
        }

        private static bool IsComplexProperty(string property)
        {
            return property.Contains(".");
        }

        private static Catalog GetCatalog(MapResult mapResult, IEntity item, MapContext context)
        {
            Catalog result;
            if (context == null)
            {
                result = mapResult.Catalogs.SingleOrDefault(c => c.ID == item.Identifier);
                if (result == null)
                {
                    result = new Catalog { ID = item.Identifier };
                    mapResult.Catalogs.Add(result);
                }
            }
            else
            {
                result = context.ParentTarget as Catalog;
            }

            return result;
        }

        private static Category GetCategory(MapResult mapResult, IEntity item, MapContext context)
        {
            Category result;
            if (context == null)
            {
                result = mapResult.Categories.SingleOrDefault(c => c.ID == item.Identifier);
                if (result == null)
                {
                    result = new Category { ID = item.Identifier };
                    mapResult.Categories.Add(result);
                }
            }
            else
            {
                result = context.ParentTarget as Category;
            }

            return result;
        }
        
        private static PriceSchedule GetPriceSchedule(MapResult mapResult, IEntity item, MapContext context)
        {
            PriceSchedule result;
            if (context == null)
            {
                result = mapResult.PriceSchedules.SingleOrDefault(c => c.ID == item.Identifier);
                if (result == null)
                {
                    result = new PriceSchedule { ID = item.Identifier };
                    mapResult.PriceSchedules.Add(result);
                }
            }
            else
            {
                result = context.ParentTarget as PriceSchedule;
            }

            return result;
        }
        private static object GetPropertyTarget(MapResult mapResult, IEntity entity, Mapping mapping, MapContext context)
        {
            object result;
            if (context == null)
            {
                switch (mapping.TargetType)
                {
                    case MappingTargetType.Catalog:
                        result = GetCatalog(mapResult, entity, null);
                        break;
                    case MappingTargetType.Category:
                        result = GetCategory(mapResult, entity, null);
                        break;
                    case MappingTargetType.PriceSchedule:
                        result = GetPriceSchedule(mapResult, entity, null);
                        break;
                    default:
                        result = mapResult.Product;
                        break;
                }
            }
            else
            {
                result = context.ParentTarget;
            }

            return result;
        }

        private async Task MapRelations(IEntity entity, MapResult result, IEnumerable<EntityMapping> mappings, MapContext context = null)
        {
            foreach (EntityMapping mapping in mappings ?? Array.Empty<EntityMapping>())
            {
                List<Task> subMappingTasks = new List<Task>();
                int index = 0;
                IEntityIterator iterator = await GetRelationEntities(entity, mapping);
                while (await iterator.MoveNextAsync())
                {
                    foreach (IEntity item in iterator.Current.Items)
                    {
                        object target = null;
                        if (!await IsFiltered(item, mapping.Where))
                        {
                            switch (mapping.TargetType)
                            {
                                case MappingTargetType.Product:
                                    target = GetRelationTarget(result.Product, item, mapping, context);
                                    break;
                                case MappingTargetType.Category:
                                    Category category = GetCategory(result, item, context);
                                    target = GetRelationTarget(category, item, mapping, context);
                                    break;
                                case MappingTargetType.Catalog:
                                    Catalog catalog = GetCatalog(result, item, context);
                                    target = GetRelationTarget(catalog, item, mapping, context);
                                    break;
                                case MappingTargetType.PriceSchedule:
                                    PriceSchedule schedule = GetPriceSchedule(result, item, context);
                                    target = GetRelationTarget(schedule, item, mapping, context);
                                    break;
                                default:
                                    _log.LogError($"MapperService: Invalid target mapping type {mapping.TargetType} for relation mapping entity {item.Id}");
                                    break;
                            }
                        }
                        
                        if (target != null)
                        {
                            MapContext subContext = new MapContext
                                                        {
                                                            ParentTarget = target,
                                                            ParentMapping = mapping,
                                                            ParentItem = item,
                                                            ParentContext = context,
                                                            Index = index
                                                        };
                            MapProperties(item, result, mapping.PropertyMappings, subContext);
                            MapExtensionData(item, target, mapping.ExtensionDataMappings);
                            subMappingTasks.Add(MapRelations(item, result, mapping.RelationMappings, subContext));
                        }

                        index++;
                    }
                }

                await Task.WhenAll(subMappingTasks);
            }
        }

        private async Task<bool> IsFiltered(IEntity item, string filter)
        {
            bool result = false;
            if (!string.IsNullOrWhiteSpace(filter))
            {
                SyntaxTree tree = CSharpSyntaxTree.ParseText(filter);
                if (tree.TryGetRoot(out SyntaxNode root))
                {
                    BinaryExpressionSyntax mainBinaryExpression =
                        root.DescendantNodes().OfType<BinaryExpressionSyntax>().FirstOrDefault();
                    if (mainBinaryExpression != null)
                    {
                        List<Diagnostic> diagnostics = mainBinaryExpression.GetDiagnostics().ToList();
                        if (diagnostics.Count == 0)
                        {
                            result = !await ProcessBinaryExpression(item, mainBinaryExpression);
                        }
                        else
                        {
                            _log.LogWarning($"MapperService: Syntax error(s) in '{filter}': {Environment.NewLine}{diagnostics.Select(d => d.GetMessage() + Environment.NewLine)}");
                        }
                    }
                    else
                    {
                        _log.LogWarning($"MapperService: No binary expression found in {filter}.");
                    }
                }
            }

            return result;
        }

        private async Task<bool> ProcessBinaryExpression(IEntity item, BinaryExpressionSyntax expression)
        {
            // NOTE [ILs] We're not here to support all possible filters that can be compiled so some combinations aren't here
            bool result = true;
            if (expression.Left is BinaryExpressionSyntax leftExpression && expression.Right is BinaryExpressionSyntax rightExpression)
            {
                bool left = await ProcessBinaryExpression(item, leftExpression);
                bool right = await ProcessBinaryExpression(item, rightExpression);
                switch (expression.OperatorToken.Kind())
                {
                    case SyntaxKind.BarBarToken:
                        result = left || right;
                        break;
                    case SyntaxKind.AmpersandAmpersandToken:
                        result = left && right;
                        break;
                    default:
                        _log.LogWarning("MapperService: Only supporting && and || between binary expressions.");
                        break;
                }
            }
            else if (expression.Left is IdentifierNameSyntax leftIdentifier && expression.Right is LiteralExpressionSyntax rightLiteral)
            {
                object leftValue = await item.GetPropertyValueAsync(leftIdentifier.Identifier.Text);
                object rightValue = rightLiteral.Token.Value;
                switch (expression.OperatorToken.Kind())
                {
                    case SyntaxKind.EqualsEqualsToken:
                        result = Equals(leftValue, rightValue);
                        break;
                    case SyntaxKind.ExclamationEqualsToken:
                        result = !Equals(leftValue, rightValue);
                        break;
                    default:
                        _log.LogWarning("MapperService: Only supporting equals or not equals between identifiers and literals.");
                        break;
                }
            }
            else
            {
                _log.LogWarning($"MapperService: Unsupported filter syntax in filter '{expression.ToFullString()}'. This doesn't mean it's C# invalid, it means the mapper doesn't know how to handle this.");
            }

            return result;
        }

        private async Task<IEntityIterator> GetRelationEntities(IEntity entity, Mapping mapping)
        {
            Query query = null;
            switch (mapping.RelationType)
            {
                case MappingRelationType.Children:
                    query = new Query
                    {
                        Filter = new RelationQueryFilter { Relation = mapping.From, ParentId = entity.Id }
                    };
                    break;
                case MappingRelationType.Parent:
                    IRelation relation = await entity.GetRelationAsync(mapping.From);
                    IList<long> ids = relation.GetIds();
                    query = Query.CreateEntitiesQuery(entities => from e in entities where e.Id.In(ids) select e);
                    break;
            }

            return query != null ? _client.Querying.CreateEntityIterator(query) : new EmptyEntityIterator();
        }

        private object GetRelationTarget(object mainTarget, IEntity item, Mapping mapping, MapContext context)
        {
            dynamic result = null;
            List<ExpandoObject> list = null;
            if (context != null)
            {
                if (mapping.TargetType != context.ParentMapping.TargetType)
                {
                    _log.LogError("MapperService: Mapping sub-relations to different types is not supported.");
                }
                else if (string.IsNullOrWhiteSpace(mapping.To))
                {
                    result = mainTarget;
                }
                else
                {
                    list = GetOrCreateProperty(context.ParentTarget, mapping.To, new List<ExpandoObject>()) as List<ExpandoObject>;
                }
            }
            else
            {
                if (string.IsNullOrWhiteSpace(mapping.To))
                {
                    result = mainTarget;
                }
                else
                {
                    list = GetOrCreateProperty(mainTarget, mapping.To, new List<ExpandoObject>()) as List<ExpandoObject>;
                }
            }

            if (list != null)
            {
                result = new ExpandoObject();
                result.Identifier = item.Identifier;
                list.Add(result);
            }

            return result;
        }

        private void MapExtensionData(IEntity entity, object target, IEnumerable<Mapping> mappings)
        {
            foreach (Mapping mapping in mappings ?? Array.Empty<Mapping>())
            {
                IDictionary<string, JToken> extensionData = entity.GetExtensionData();
                if (extensionData.ContainsKey(mapping.From))
                {
                    JToken token = entity.GetExtensionData()[mapping.From];
                    object value = null;
                    switch (mapping.Type)
                    {
                        case MappingType.String:
                            value = token.Value<string>();
                            break;
                        case MappingType.Bool:
                            value = token.Value<bool>();
                            break;
                        case MappingType.Double:
                            value = token.Value<double>();
                            break;
                        case MappingType.Int:
                            value = token.Value<int>();
                            break;
                        default:
                            _log.LogError($"MapperService: Invalid mapping type {mapping.Type} while mapping extension data for entity {entity.Id}");
                            break;
                    }

                    SetProperty(target, mapping.To, value);
                }
                else
                {
                    _log.LogError($"MapperService: Could not find the {mapping.From} key in the extension data for entity {entity.Id}");
                }
            }
        }

        private void MapProperties(IEntity entity, MapResult result, IEnumerable<Mapping> mappings, MapContext context = null)
        {
            foreach (Mapping mapping in mappings ?? Array.Empty<Mapping>())
            {
                object mappingTarget = GetPropertyTarget(result, entity, mapping, context);
                if (IsComplexProperty(mapping.To))
                {
                    MapComplexProperty(entity, mappingTarget, mapping, context);
                }
                else
                {
                    MapProperty(entity, mappingTarget, mapping);
                }

                if (mapping.Facet)
                {
                    MapFacet(mapping, result, context);
                }
            }
        }

        private void MapFacet(Mapping mapping, MapResult result, MapContext context)
        {
            if (!mapping.To.StartsWith("xp."))
            {
                _log.LogWarning($"MapperService: Invalid mapping '{mapping.To}' flagged as facet, only xp mappings can be facets.");
            }
            else if (context != null)
            {
                List<string> facetXpPathPieces = new List<string> { mapping.To };
                MapContext currentContext = context;
                bool topMappingReached = false;
                while (currentContext.ParentContext != null && !topMappingReached)
                {
                    string mappingPath = currentContext.ParentMapping.To;
                    facetXpPathPieces.Add(mappingPath);
                    if (mappingPath.StartsWith("xp."))
                    {
                        topMappingReached = true;
                    }

                    currentContext = currentContext.ParentContext;
                }

                facetXpPathPieces.Reverse();
                string fullFacetXpPath = string.Join('.', facetXpPathPieces);
                result.ProductFacets.Add(new ProductFacet { ID = fullFacetXpPath, Name = fullFacetXpPath, XpPath = fullFacetXpPath, MinCount = 1 });
            }
            else if (result.ProductFacets.All(f => f.XpPath != mapping.To))
            {
                result.ProductFacets.Add(new ProductFacet { ID = mapping.To, Name = mapping.To, XpPath = mapping.To, MinCount = 1 });
            }
        }

        private void MapComplexProperty(IEntity entity, object target, Mapping mapping, MapContext context)
        {
            // NOTE [ILs] Taking shortcut here since we only support Product, Category, Catalog and PriceSchedule and only xp, Inventory and PriceBreaks are complex objects.
            if (mapping.To.StartsWith("xp."))
            {
                string[] path = mapping.To.Split(".", StringSplitOptions.RemoveEmptyEntries);
                int lastPathIndex = path.Length - 1;
                ExpandoObject expando =
                    GetOrCreateProperty(target, string.Join('.', path.Take(lastPathIndex))) as ExpandoObject;
                WriteDynamicProperty(expando, path[lastPathIndex], GetEntityValue(entity, mapping));
            }
            else if (mapping.To.StartsWith("Inventory.") && target is Product product)
            {
                mapping.To = StripComplexitySegment(mapping.To);
                MapProperty(entity, product.Inventory, mapping);
            }
            else if (mapping.To.StartsWith("PriceBreaks[") && target is PriceSchedule priceSchedule)
            {
                // NOTE [ILs] PriceBreaks are hard to deal with because they have no identifying value (except quantity?)
                // So we're resorting to giving access to the index either directly (numeric) or by using "i" which will take the context index
                int index = ParseIndex(mapping.To, context);
                PriceBreak pb;
                if (index < 0 || index >= priceSchedule.PriceBreaks.Count)
                {
                    pb = new PriceBreak();
                    priceSchedule.PriceBreaks.Add(pb);
                }
                else
                {
                    pb = priceSchedule.PriceBreaks[index];
                }

                mapping.To = StripComplexitySegment(mapping.To);
                MapProperty(entity, pb, mapping);
            }
            else
            {
                _log.LogError($"MapperService: Invalid complex type target {mapping.To} while mapping entity {entity.Id}");
            }
        }

        private int ParseIndex(string s, MapContext context)
        {
            int result = -1;
            int startIndex = s.IndexOf('[');
            int closingIndex = s.IndexOf(']');
            if (startIndex < 0 || closingIndex < 0)
            {
                _log.LogError($"MapperService: Invalid indexer when trying to parse {s}");
            }
            else
            {
                startIndex++;
                string value = s.Substring(startIndex, closingIndex - startIndex);
                if (value == "i")
                {
                    result = context.Index;
                }
                else if (int.TryParse(value, out int parsed))
                {
                    result = parsed;
                }
                else
                {
                    _log.LogError($"MapperService: Invalid index value when trying to parse {s}");
                }
            }

            return result;
        }

        private void MapProperty(IEntity entity, object target, Mapping mapping)
        {
            object value = !string.IsNullOrWhiteSpace(mapping.Value) ? MapValue(mapping) : GetEntityValue(entity, mapping);
            SetProperty(target, mapping.To, value);
        }

        private void SetProperty(object target, string name, object value)
        {
            if (target is ExpandoObject expando)
            {
                WriteDynamicProperty(expando, name, value);
            }
            else
            {
                Type t = target.GetType();
                PropertyInfo pi = t.GetProperty(name);
                if (pi != null)
                {
                    pi.SetValue(target, value);
                }
                else
                {
                    _log.LogError($"MapperService: Couldn't find {name} on type {t}");
                }
            }
        }

        private object GetOrCreateProperty(object target, string name, object initialValue = null)
        {
            object result = null;
            Type t = target.GetType();
            if (IsComplexProperty(name))
            {
                // NOTE [ILs] Taking shortcut here since we only support Product, Category and Catalog and only xp and Inventory are complex objects.
                if (name.StartsWith("Inventory.") && t == typeof(Product))
                {
                    PropertyInfo pi = t.GetProperty("Inventory");
                    result = pi?.GetValue(target) as Inventory;
                }
                else if (name.StartsWith("xp."))
                {
                    PropertyInfo pi = t.GetProperty("xp");
                    dynamic xp = pi?.GetValue(target);
                    string[] path = name.Split(".", StringSplitOptions.RemoveEmptyEntries);
                    dynamic parent = xp;
                    for (int i = 1; i < path.Length; i++)
                    {
                        dynamic current = ReadDynamicProperty(parent, path[i]);
                        if (current == null)
                        {
                            current = initialValue ?? new ExpandoObject();
                            WriteDynamicProperty(parent, path[i], current);
                        }

                        if (i == path.Length - 1)
                        {
                            result = current;
                        }
                        else
                        {
                            parent = current;
                        }
                    }
                }
                else
                {
                    _log.LogError($"MapperService: Could not find complex property {name} on type {t}");
                }
            }
            else if (target is ExpandoObject expando)
            {
                result = ReadDynamicProperty(expando, name);
                if (result == null && initialValue != null)
                {
                    result = initialValue;
                    WriteDynamicProperty(expando, name, result);
                }
            }
            else
            {
                PropertyInfo pi = t.GetProperty(name);
                if (pi != null)
                {
                    result = pi.GetValue(target);
                }
                else
                {
                    _log.LogError($"MapperService: Could not find property {name} on type {t}");
                }
            }

            return result;
        }

        private object GetEntityValue(IEntity entity, Mapping mapping)
        {
            object result = null;
            switch (mapping.Type)
            {
                case MappingType.Bool:
                    result = entity.GetPropertyValue<bool>(mapping.From);
                    break;
                case MappingType.Double:
                    result = entity.GetPropertyValue<double>(mapping.From);
                    break;
                case MappingType.Int:
                    result = entity.GetPropertyValue<int>(mapping.From);
                    break;
                case MappingType.Decimal:
                    result = entity.GetPropertyValue<decimal>(mapping.From);
                    break;
                case MappingType.Float:
                    result = entity.GetPropertyValue<float>(mapping.From);
                    break;
                case MappingType.Long:
                    result = entity.GetPropertyValue<long>(mapping.From);
                    break;
                case MappingType.String:
                    result = !string.IsNullOrWhiteSpace(mapping.Culture)
                                 ? entity.GetPropertyValue<string>(
                                     mapping.From,
                                     new CultureInfo(mapping.Culture))
                                 : entity.GetPropertyValue<string>(mapping.From);
                    break;
                default:
                    _log.LogError($"MapperService: Invalid mapping type {mapping.Type} for property mapping while mapping entity {entity.Id}");
                    break;
            }

            return result;
        }

        private object MapValue(Mapping mapping)
        {
            object result = null;
            switch (mapping.Type)
            {
                case MappingType.Bool:
                    if (bool.TryParse(mapping.Value, out bool bParsed))
                    {
                        result = bParsed;
                    }
                    else
                    {
                        result = default(bool);
                        _log.LogError($"MapperService: {mapping.Value} was not a valid {mapping.Type}");
                    }

                    break;
                case MappingType.Double:
                    if (double.TryParse(mapping.Value, out double dParsed))
                    {
                        result = dParsed;
                    }
                    else
                    {
                        result = default(double);
                        _log.LogError($"MapperService: {mapping.Value} was not a valid {mapping.Type}");
                    }

                    break;
                case MappingType.Int:
                    if (int.TryParse(mapping.Value, out int iParsed))
                    {
                        result = iParsed;
                    }
                    else
                    {
                        result = default(int);
                        _log.LogError($"MapperService: {mapping.Value} was not a valid {mapping.Type}");
                    }

                    break;
                case MappingType.Decimal:
                    if (decimal.TryParse(mapping.Value, out decimal cParsed))
                    {
                        result = cParsed;
                    }
                    else
                    {
                        result = default(decimal);
                        _log.LogError($"MapperService: {mapping.Value} was not a valid {mapping.Type}");
                    }

                    break;
                case MappingType.Float:
                    if (float.TryParse(mapping.Value, out float fParsed))
                    {
                        result = fParsed;
                    }
                    else
                    {
                        result = default(float);
                        _log.LogError($"MapperService: {mapping.Value} was not a valid {mapping.Type}");
                    }

                    break;
                case MappingType.Long:
                    if (long.TryParse(mapping.Value, out long lParsed))
                    {
                        result = lParsed;
                    }
                    else
                    {
                        result = default(long);
                        _log.LogError($"MapperService: {mapping.Value} was not a valid {mapping.Type}");
                    }

                    break;
                case MappingType.String:
                    result = mapping.Value;
                    break;
                default:
                    _log.LogError($"MapperService: Invalid mapping type {mapping.Type} for value mapping");
                    break;
            }

            return result;
        }
    }
}
